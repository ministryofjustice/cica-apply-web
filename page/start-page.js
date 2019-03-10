const output = `{% extends "page.njk" %}
    {% from "components/button/macro.njk" import govukButton %}
    
    {% block content %}
    <main role="main" class="govuk-main-wrapper">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-xl">
            Apply for criminal injuries compensation
          </h1>
          <p class="govuk-body-l">Use this service to apply for compensation if:</p>
          <ul class="govuk-list govuk-list--bullet">
            <li>you were the victim of a sexual crime or abuse</li>
            <li>you suffered mental injuries because of a violent crime</li>
            <li>you suffered physical injuries because of a violent crime</li>
            <li>you saw a violent crime happen to a loved one, or were there immediately afterwards</li>
            <li>a close relative died because of a violent crime</li>
            <li>you paid for the funeral of someone who died because of a violent crime</li>
          </ul>
          <p class="govuk-body">If the crime has not been reported to the police we can not pay compensation.</p>
          <p class="govuk-body">The crime must have happened in England, Wales, Scotland or <a href="">another relevant place.</a></p>
          <p class="govuk-body">There is a different service for <a href="https://www.justice-ni.gov.uk/topics/justice-and-law/compensation-services">Northern Ireland</a>.</p>
          <form name="questionnaire-form" id="questionnaire-form" method="post">
            {{
              govukButton({
                text: "Start now",
                classes: "govuk-button govuk-button--start govuk-!-mt-r2 govuk-!-mb-r8"
              })
            }}
          </form>
          <h1 class="govuk-heading-l">Before you start
           </h1>
          <p class="govuk-body">To complete the application we will ask for the:</p>
          <ul class="govuk-list govuk-list--bullet">
            <!-- <li>an email address we can use to contact you</li> -->
            <li>approximate date that the crime happened</li>
            <li>name of the police force that is dealing with the crime</li>
            <li>crime reference number</li>
            <li>location where the crime happened</li>
          </ul>
          <p class="govuk-body">If you do not have any of this information you can <a href="https://www.police.uk/contact/101/">contact the police</a>.</p>
          <p class="govuk-body">Compensation is paid by the government, not the offender. We may be able to pay compensation even if the offender is not identified or convicted.</p>
          <h2 class="govuk-heading-l">
            Eligibility
          </h2>
          <p class="govuk-body">Usually you must apply within 2 years of when the crime happened. We may be able to make an exception if you:</p>
          <ul class="govuk-list govuk-list--bullet">
            <li>were under 18 at the time</li>
            <li>can show that you could not apply earlier</li>
          </ul>
          <h2 class="govuk-heading-l">
            Other ways to apply
          </h2>
          <p class="govuk-body">You can contact us for help with your application on 0300 003 3601. Select option 8.</p>
          <p class="govuk-body">Our phone lines are open Monday to Friday 8.30am to 5pm except Wednesday when they open at 10am.</p>
          <h2 class="govuk-heading-l">Help and support
          </h2>
          <p class="govuk-body">For practical or emotional support near you <a href="https://www.victimandwitnessinformation.org.uk/">visit the Victim and Witness Information</a> website.</p>
          <p class="govuk-body">There is a different website if you live in <a href="https://www.mygov.scot/victim-witness-support/">Scotland</a>.</p>
          <p class="govuk-body">You do not need a legal representative to make an application.</p>
        </div>
        <div class="govuk-grid-column-one-third">
          <aside class="app-related-items" role="complementary">
            <h2 class="govuk-heading-m" id="subsection-title">
              Related contents
            </h2>
            <nav role="navigation" aria-labelledby="subsection-title">
              <ul class="govuk-list govuk-body-s">
                <li>
                  <a target="_blank" href="https://www.gov.uk/guidance/criminal-injuries-compensation-a-guide">
                    A guide to the Criminal Injuries Compensation Scheme
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </main>
    {% endblock %}
    `;

module.exports = output;
