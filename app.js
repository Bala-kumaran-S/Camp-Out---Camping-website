const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))

//routes
app.get('/',(req,res) => {
    res.render('./home')
}) 


app.listen(3000, () => {
    console.log('listening on port : ')
})