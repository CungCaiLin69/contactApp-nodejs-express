const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { findContact, loadContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utils/contacts')
const { check, body, validationResult } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// flash configuration
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(flash())

app.get('/', (req, res) => {
  // res.sendFile('./index.html', {root: __dirname})
  const mahasiswa = [
    {
      nama: 'Sendy Adriansyah',
      email: 'sendy.adriansyah17@gekkou.ac.jp'
    },
    {
      nama: 'Makoto Yuki',
      email: 'makoto.y@gekkou.ac.jp'
    },
    {
      nama: 'Yukari Takeba',
      email: 'yukari.t@gekkou.ac.jp'
    }
  ];
  res.render('index', {
    nama: 'Sendy',
    title: 'Home Page',
    mahasiswa,
    layout: 'layout/main-layout'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layout/main-layout',
    title: 'About Page'
  })
})

app.get('/contact', (req, res) => {
  const contacts = loadContact();

  res.render('contact', {
    layout: 'layout/main-layout',
    title: 'Contact Page',
    contacts,
    msg: req.flash('msg'),
  })
})

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Add Contact Form',
    layout: 'layout/main-layout',
  })
})  

app.post('/contact', [
  body('name').custom((value) => {
    const duplicate = cekDuplikat(value)
    if(duplicate){
      throw new Error('Contact name already exists')
    }
    return true
  }),
  check('email', 'Invalid email address').isEmail(),
  check('nohp', 'Invalid Phone Number').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()})
    res.render('add-contact', {
      title: 'Add contact form',
      layout: 'layout/main-layout',
      errors: errors.array(),
    })
  } else {
      addContact(req.body)
      req.flash('msg', 'Contact added successfully')
      res.redirect('/contact')
    }
})

// Delete contact process
app.get('/contact/delete/:name', (req, res) => {
  const contact = findContact(req.params.name);

  //if contact doesnt exist
  if(!contact){
    res.status(404)
    res.send('<h1>404</h1>')
  } else {
    deleteContact(req.params.name)
    req.flash('msg', 'Contact deleted successfully')
    res.redirect('/contact')
  }
})

// Edit contact form
app.get('/contact/edit/:name', (req, res) => {
  const contact = findContact(req.params.name)

  res.render('edit-contact', {
    title: 'Edit contact form',
    layout: 'layout/main-layout',
    contact
  })
})

// edit data process
app.post('/contact/update', [
  body('name').custom((value, {req}) => {
    const duplicate = cekDuplikat(value)
    if(value !== req.body.oldName && duplicate){
      throw new Error('Contact name already exists')
    }
    return true
  }),
  check('email', 'Invalid email address').isEmail(),
  check('nohp', 'Invalid Phone Number').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    // return res.status(400).json({errors: errors.array()})
    res.render('edit-contact', {
      title: 'Edit contact form',
      layout: 'layout/main-layout',
      errors: errors.array(),
      contact: req.body
    })
  } else {
      updateContacts(req.body)
      req.flash('msg', 'Contact edited successfully')
      res.redirect('/contact')
    }
})

app.get('/contact/:name', (req, res) => {
  const contact = findContact(req.params.name);

  res.render('detail', {
    layout: 'layout/main-layout',
    title: 'Detail Page',
    contact
  })
})

app.use('/', (req, res) => {
  res.status(404)
  res.send('<h1>404</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})