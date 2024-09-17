var express = require('express');
var cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const multer = require('multer');

var app = express()
  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const upload = multer({ dest: 'uploads/' });
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.json({ error: 'No file uploaded' });
  }

  const fileInfo = {
    name: req.file.originalname, 
    type: req.file.mimetype,
    size: req.file.size 
  };

  res.json(fileInfo);
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
