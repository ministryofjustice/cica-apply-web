'use strict';

const expectedSummaryHtml = {
    html: `<!DOCTYPE html>
        <html lang="en" class="govuk-template ">
        
        <head>
            <meta charset="utf-8">
            <title> Draft Application Summary - GOV.UK - The best place to find government services and information </title>
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
            <meta name="theme-color" content="#0b0c0c">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
                .govuk-heading-xl {
                    color: #0b0c0c;
                    font-weight: 700;
                    font-size: 32px;
                    font-size: 2rem;
                    line-height: 1.09375;
                    display: block;
                    margin-top: 0;
                    margin-bottom: 30px;
                }
        
                @media print {
                    .govuk-heading-xl {
                        color: #000000;
                        font-weight: 700;
                        font-size: 32px;
                        font-size: 2rem;
                        line-height: 1.15;
                        display: block;
                        margin-top: 0;
                        margin-bottom: 30px;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-heading-xl {
                        font-size: 48px;
                        font-size: 3rem;
                        line-height: 1.04167;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-heading-xl {
                        margin-bottom: 50px;
                    }
                }
        
                .govuk-heading-l {
                    color: #0b0c0c;
                    font-weight: 700;
                    font-size: 24px;
                    font-size: 1.5rem;
                    line-height: 1.04167;
                    display: block;
                    margin-top: 0;
                    margin-bottom: 20px;
                }
        
                @media print {
                    .govuk-heading-l {
                        color: #000000;
                    }
                }
        
                @media print {
                    .govuk-heading-l {
                        font-family: sans-serif;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-heading-l {
                        font-size: 36px;
                        font-size: 2.25rem;
                        line-height: 1.11111;
                    }
                }
        
                @media print {
                    .govuk-heading-l {
                        font-size: 24pt;
                        line-height: 1.05;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-heading-l {
                        margin-bottom: 30px;
                    }
                }
        
                .govuk-grid-row {
                    margin-right: -15px;
                    margin-left: -15px;
                }
        
                .govuk-grid-row:after {
                    content: "";
                    display: block;
                    clear: both;
                }
        
                .govuk-grid-column-two-thirds {
                    box-sizing: border-box;
                    width: 100%;
                    padding: 0 15px;
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-grid-column-two-thirds {
                        width: 66.6666%;
                        float: left;
                    }
                }
        
                .govuk-template {
                    overflow-y: scroll;
                }
        
                .govuk-template {
                    background-color: #f3f2f1;
                    text-size-adjust: 100%;
                }
        
                .govuk-template__body {
                    font-family: "GDS Transport", Arial, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    margin: 0;
                    background-color: #ffffff;
                }
        
                .govuk-width-container {
                    max-width: 960px;
                    margin: 0 15px;
                }
        
                @supports (margin: max(calc(0px))) {
                    .govuk-width-container {
                        margin-right: max(15px, calc(15px + env(safe-area-inset-right)));
                        margin-left: max(15px, calc(15px + env(safe-area-inset-left)));
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-width-container {
                        margin: 0 30px;
                    }
        
                    @supports (margin: max(calc(0px))) {
                        .govuk-width-container {
                            margin-right: max(30px, calc(15px + env(safe-area-inset-right)));
                            margin-left: max(30px, calc(15px + env(safe-area-inset-left)));
                        }
                    }
                }
        
                @media (min-width: 1020px) {
                    .govuk-width-container {
                        margin: 0 auto;
                    }
        
                    @supports (margin: max(calc(0px))) {
                        .govuk-width-container {
                            margin: 0 auto;
                        }
                    }
                }
        
                .govuk-main-wrapper {
                    display: block;
                    padding-top: 20px;
                    padding-bottom: 20px;
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-main-wrapper {
                        padding-top: 40px;
                        padding-bottom: 40px;
                    }
                }
        
                .govuk-summary-list {
                    font-weight: 400;
                    font-size: 16px;
                    font-size: 1rem;
                    line-height: 1.25;
                    color: #0b0c0c;
                    margin: 0 0 20px;
                }
        
                @media print {
                    .govuk-summary-list {
                        font-family: sans-serif;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list {
                        font-size: 19px;
                        font-size: 1.1875rem;
                        line-height: 1.31579;
                    }
                }
        
                @media print {
                    .govuk-summary-list {
                        font-size: 14pt;
                        line-height: 1.15;
                    }
                }
        
                @media print {
                    .govuk-summary-list {
                        color: #000000;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list {
                        display: table;
                        width: 100%;
                        table-layout: fixed;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list {
                        margin-bottom: 30px;
                    }
                }
        
                .govuk-heading-l {
                    color: #0b0c0c;
                    font-weight: 700;
                    font-size: 24px;
                    font-size: 1.5rem;
                    line-height: 1.04167;
                    display: block;
                    margin-top: 0;
                    margin-bottom: 20px;
                }
        
                @media print {
                    .govuk-heading-l {
                        color: #000000;
                    }
                }
        
                @media print {
                    .govuk-heading-l {
                        font-family: sans-serif;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-heading-l {
                        font-size: 36px;
                        font-size: 2.25rem;
                        line-height: 1.11111;
                    }
                }
        
                @media print {
                    .govuk-heading-l {
                        font-size: 24pt;
                        line-height: 1.05;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-heading-l {
                        margin-bottom: 30px;
                    }
                }
        
                .govuk-\\!-margin-bottom-9 {
                    margin-bottom: 40px !important;
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-\\!-margin-bottom-9 {
                        margin-bottom: 60px !important;
                    }
                }
        
                .govuk-summary-list {
                    font-weight: 400;
                    font-size: 16px;
                    font-size: 1rem;
                    line-height: 1.25;
                    color: #0b0c0c;
                    margin: 0 0 20px;
                }
        
                @media print {
                    .govuk-summary-list {
                        font-family: sans-serif;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list {
                        font-size: 19px;
                        font-size: 1.1875rem;
                        line-height: 1.31579;
                    }
                }
        
                @media print {
                    .govuk-summary-list {
                        font-size: 14pt;
                        line-height: 1.15;
                    }
                }
        
                @media print {
                    .govuk-summary-list {
                        color: #000000;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list {
                        display: table;
                        width: 100%;
                        table-layout: fixed;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list {
                        margin-bottom: 30px;
                    }
                }
        
                @media (max-width: 40.0525em) {
                    .govuk-summary-list__row {
                        margin-bottom: 15px;
                        border-bottom: 1px solid #b1b4b6;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list__row {
                        display: table-row;
                    }
                }
        
                .govuk-\\!-width-one-half {
                    width: 100% !important;
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-\\!-width-one-half {
                        width: 50% !important;
                    }
                }
        
                .govuk-summary-list__actions,
                .govuk-summary-list__key,
                .govuk-summary-list__value {
                    margin: 0;
                }
        
                @media (min-width: 40.0625em) {
        
                    .govuk-summary-list__actions,
                    .govuk-summary-list__key,
                    .govuk-summary-list__value {
                        display: table-cell;
                        padding-right: 20px;
                    }
                }
        
                @media (min-width: 40.0625em) {
        
                    .govuk-summary-list__actions,
                    .govuk-summary-list__key,
                    .govuk-summary-list__value {
                        padding-top: 10px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #b1b4b6;
                    }
                }
        
                .govuk-summary-list__actions {
                    margin-bottom: 15px;
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list__actions {
                        width: 20%;
                        padding-right: 0;
                        text-align: right;
                    }
                }
        
                .govuk-summary-list__key,
                .govuk-summary-list__value {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
        
                .govuk-summary-list__key {
                    margin-bottom: 5px;
                    font-weight: 700;
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list__key {
                        width: 30%;
                    }
                }
        
                @media (max-width: 40.0525em) {
                    .govuk-summary-list__value {
                        margin-bottom: 15px;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list__value {
                        width: 50%;
                    }
                }
        
                @media (min-width: 40.0625em) {
                    .govuk-summary-list__value:last-child {
                        width: 70%;
                    }
                }
        
                .govuk-summary-list__value>p {
                    margin-bottom: 10px;
                }
        
                .govuk-summary-list__value> :last-child {
                    margin-bottom: 0;
                }
        
                .div-header-address {
                    font-size: 24px;
                }
        
                .div-draft-size {
                    font-size: 30px;
                }
        
                @media print {
                    .div-draft-size {
                        font-size: 15px;
                    }
                }
        
                .div-black-box {
                    background-color: black;
                    padding: 20px;
                    color: white;
                    font-size: 24px;
                }
            </style>
        </head>
        
        <body class="govuk-template__body ">
            <div class="govuk-width-container "> <br>
                <div class="div-header-address"> <b>CICA </b> <br> 10 Clyde Place <br> Buchanan Wharf <br> Glasgow <br> G5 8AQ <br> <br> Telephone: 0300 003 3601 <br> www.cica.gov.uk </div>
                <div class="div-draft-size">
                    <h1> <b>DRAFT COPY:</b>CICA application</h1>
                </div>
                <div class="div-black-box"> This is a summary of your answers. <b>It does not represent a complete
                        application.</b> </div>
            </div>
            <div class="govuk-width-container ">
                <main class="govuk-main-wrapper " id="main-content" role="main">
                    <div class="govuk-grid-row">
                        <div class="govuk-grid-column-two-thirds">
                            <h1 class="govuk-heading-l">Check your answers before sending your application</h1>
                            <h2 class="govuk-heading-l">About your application</h2>
                            <dl class="govuk-summary-list govuk-!-margin-bottom-9">
                                <div class="govuk-summary-list__row">
                                    <dt class="govuk-summary-list__key govuk-!-width-one-half"> What would you like to do?
                                    </dt>
                                    <dd class="govuk-summary-list__value"> Start a new application </dd>
                                </div>
                                <div class="govuk-summary-list__row">
                                    <dt class="govuk-summary-list__key govuk-!-width-one-half"> Are you applying because
                                        someone died? </dt>
                                    <dd class="govuk-summary-list__value"> No </dd>
                                </div>
                                <div class="govuk-summary-list__row">
                                    <dt class="govuk-summary-list__key govuk-!-width-one-half"> Was the crime reported to the
                                        police? </dt>
                                    <dd class="govuk-summary-list__value"> Yes </dd>
                                </div>
                                <div class="govuk-summary-list__row">
                                    <dt class="govuk-summary-list__key govuk-!-width-one-half"> Do you have a crime reference
                                        number? </dt>
                                    <dd class="govuk-summary-list__value"> Yes </dd>
                                </div>
                                <div class="govuk-summary-list__row">
                                    <dt class="govuk-summary-list__key govuk-!-width-one-half"> Who are you applying for?
                                    </dt>
                                    <dd class="govuk-summary-list__value"> Myself </dd>
                                </div>
                                <div class="govuk-summary-list__row">
                                    <dt class="govuk-summary-list__key govuk-!-width-one-half"> Are you 18 or over? </dt>
                                    <dd class="govuk-summary-list__value"> Yes </dd>
                                </div>
                                <div class="govuk-summary-list__row">
                                    <dt class="govuk-summary-list__key govuk-!-width-one-half"> Are you a British citizen or
                                        EU national? </dt>
                                    <dd class="govuk-summary-list__value"> Yes </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </main>
            </div>
        </body>
        <footer class="govuk-footer " role="contentinfo">
            <div class="govuk-width-container "> Downloaded on Saturday, January 1, 2022 5:15 PM </div>
        </footer> <br><br><br><br><br>
        
        </html>`
};

module.exports = expectedSummaryHtml;
