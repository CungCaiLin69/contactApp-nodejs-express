const fs = require('fs');

//make a folder path if it doesn't exist
const dirPath = './data'
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
}

//make a contact.json file if it doesn't exist
const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// get all data in contact.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer)

    return contacts;
}

// find contact based on name
const findContact = (name) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());

    return contact
}

// write / overwrite contacts.json with new file
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// add new contact data
const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

// check duplicated name
const cekDuplikat = (name) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.name === name)
}

// Delete a contact
const deleteContact = (name) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.name !== name)

    saveContacts(filteredContacts)
}

const updateContacts = (newContact) => {
    const contacts = loadContact()

    // remove old contact that similiar with oldName
    const filteredContacts = contacts.filter((contact) => contact.name !== newContact.oldName)
    delete newContact.oldName

    filteredContacts.push(newContact)
    saveContacts(filteredContacts)
}

module.exports = { findContact, loadContact, addContact, cekDuplikat, deleteContact, updateContacts }