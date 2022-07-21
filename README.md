# tes-praktek-node-js-progammer

```
git clone git@github.com:rikian/tes-praktek-node-js-progammer.git
```
```
npm install
```
```
npm run start or node index
```
```javascript
user name : rikian
password : 54ng4t_R@h451A....

atau dapat diubah di bagian middleware.js

...
if (!dataLogin || 
    !dataLogin["email"] || 
    !dataLogin["password"] || 
    dataLogin["email"] !== "rikian" || 
    dataLogin["password"] !== "54ng4t_R@h451A...."
    ) return res.render("login", { "host" : `${host}/static` })
...
```
```javascript
jika error, jangan lupa uncoment host di file config.js
const host = `https://tes-praktek-node-js-progammer.herokuapp.com`
// const host = `http://localhost:9091`
```
