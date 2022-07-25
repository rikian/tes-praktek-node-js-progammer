function parseMessage(buffer) {
    try {
      const firstByte = buffer.readUInt8(0);
      const opCode = firstByte & 0xf;
  
      // 0 = continuation frame
      if (opCode === 0x0) return false;
  
      // 1 = text frame or string
      if (opCode === 0x1) {
        const secondByte = buffer.readUInt8(1);
        // console.log("9"+" = "+secondByte)
        const isMasked = Boolean((secondByte >>> 7) & 0x1);
        // console.log("10"+" = "+isMasked)
        // Keep track of our current position as we advance through the buffer
        let currentOffset = 2;
        let payloadLength = secondByte & 0x7f;
        // console.log("11"+" = "+payloadLength)
  
        if (payloadLength > 125) {
          if (payloadLength === 126) {
            payloadLength = buffer.readUInt16BE(currentOffset);
            currentOffset += 2;
          } else {
            // 127
            // If this has a value, the frame size is ridiculously huge!
            const leftPart = buffer.readUInt32BE(currentOffset);
            const rightPart = buffer.readUInt32BE((currentOffset += 4));
            // Honestly, if the frame length requires 64 bits, you're probably doing it wrong.
            // In Node.js you'll require the BigInt type, or a special library to handle this.
            throw new Error("Large payloads not currently implemented");
          }
        }
  
        let maskingKey;
  
        if (isMasked) {
          maskingKey = buffer.readUInt32BE(currentOffset);
          currentOffset += 4;
        }
  
        // Allocate somewhere to store the final message data
        const data = Buffer.alloc(payloadLength);
        // Only unmask the data if the masking bit was set to 1
        if (isMasked) {
          // Loop through the source buffer one byte at a time, keeping track of which
          // byte in the masking key to use in the next XOR calculation
          for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
            // Extract the correct byte mask from the masking key
            const shift = j == 3 ? 0 : (3 - j) << 3;
            const mask = (shift == 0 ? maskingKey : maskingKey >>> shift) & 0xff;
            // Read a byte from the source buffer
            const source = buffer.readUInt8(currentOffset++);
            // XOR the source byte and write the result to the data
            data.writeUInt8(mask ^ source, i);
          }
        } else {
          // Not masked - we can just read the data as-is
          buffer.copy(data, 0, currentOffset++);
        }
  
        const json = data.toString("utf8");
        return JSON.parse(json);
      }
  
      // 2 = binary frame
      if (opCode === 0x2) return false;
  
      // 3 ~ 7 are reserved for further non-control frames
      if (opCode === 0x3 || opCode === 0x4 || opCode === 0x5 || opCode === 0x6 || opCode === 0x7) return false;
  
      // 8 = connection close
      if (opCode === 0x8) return "close";
  
      // 9 = ping
      if (opCode === 0x9) return "ping";
  
      // 10 = pong
      if (opCode === 0xa) return "pong";
  
      // opcode 0xb ~ 0xf are reserved for further non-control frames
      if (opCode === 0xb || opCode === 0xc || opCode === 0xd || opCode === 0xe || opCode === 0xf) return false;
  
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
function parseToBuffer(opCode, contentType) {
  try {
    // text = 129 ping = 137, pong = 138
    let string = null;

    if (opCode === 129 && typeof contentType === "object") {
      string = JSON.stringify(contentType);
    }

    if (opCode === 137 || opCode === 138) {
      string = "p";
    }

    if (string !== null && typeof string === "string") {
      const stringByteLength = Buffer.byteLength(string);
      const lengthByteCount = stringByteLength < 126 ? 0 : 2;
      const payloadLength = lengthByteCount === 0 ? stringByteLength : 126;
      const buffer = Buffer.alloc(2 + lengthByteCount + stringByteLength);

      buffer.writeUInt8(opCode, 0);
      buffer.writeUInt8(payloadLength, 1);

      let payloadOffset = 2;

      if (lengthByteCount > 0) {
        buffer.writeUInt16BE(stringByteLength, 2);
        payloadOffset += lengthByteCount;
      }

      buffer.write(string, payloadOffset);

      return buffer;
    }

    return false;
  } catch (error) {
    console.log(error);

    return false;
  }
}

module.exports = { parseMessage, parseToBuffer }