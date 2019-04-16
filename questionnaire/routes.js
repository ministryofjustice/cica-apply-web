const express = require('express');
const nunjucks = require('nunjucks');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('questionnaire.njk');
});

router.get('/consent', (req, res) => {
    res.render('consent.njk');
});

router.get('/start-page', (req, res) => {
    res.render('start-page.njk');
});

router.get('/cookies', (req, res) => {
    res.render('cookies.njk');
});

router.get('/contact-us', (req, res) => {
    res.render('contact-us.njk');
});

router.get('/nunjucksz', (req, res) => {
    nunjucks.configure(
        [
            'node_modules/govuk-frontend/',
            'node_modules/govuk-frontend/components/',
            'questionnaire/',
            'page/'
        ],
        {
            autoescape: true
        }
    );
    //

    const html = nunjucks.renderString(
        // '{{2+3}}{{2+3}}{{2+3}}'
        '{% from "input/macro.njk" import govukInput %}{{govukInput({label:{text:"Full namezzzzzzzzzzzzzz",isPageHeading:true},id:"name",name:"name"})}}'
    );

    console.log({html});

    // // {% from "input/macro.njk" import govukInput %}

    res.send(html);
    // res.render('questionnaire.njk');
});

router.get('/form', (req, res) => {
    res.render('form.njk');
});

router.get('/form2', (req, res) => {
    res.render('form2.njk');
});

router.post('/form', (req, res) => {
    console.log('BODY: ', req.body);

    res.send('POSTED!!');
});

module.exports = router;
