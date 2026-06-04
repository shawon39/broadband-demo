# RPRocketVC Call-Record Demo

A static, Salesforce-styled (SLDS-native) call-record page used for the RPRocketVC
Salesforce World Tour demo. It shows a recorded discovery call with an Agentforce
summary, action items, transcript, and an engagement analytics tab.

It is a fully static page (HTML/CSS/vanilla JS, Font Awesome via CDN) designed to be
embedded inside a Salesforce Lightning page via an iframe.

## Live page

Hosted on GitHub Pages:

```
https://shawon39.github.io/broadband-demo/
```

## Project structure

```
index.html        # Page markup (record layout, tabs, inline engagement SVG chart)
css/
  base.css        # Design tokens (colour, spacing, type, radii) + resets
  layout.css      # Page grid, cards, badges
  components.css  # Buttons, tabs, transcript, avatars, action items, video hero
  engagement.css  # Engagement tab (KPIs, charts, sentiment, talk-time)
  agentforce.css  # Agentforce summary accent
js/main.js        # Tab switching, filters, tooltips, chapter navigation
assets/           # Agentforce bot icon + localized participant headshots
```

## Embedding in Salesforce

1. Setup -> Security -> CSP Trusted Sites -> New
   - URL: `https://shawon39.github.io`
   - Enable context: `frame-src` (and `style-src` / `font-src` / `connect-src`).
2. Create a Visualforce page that frames this site:
   ```html
   <apex:page showHeader="false" sidebar="false" standardStylesheets="false">
     <iframe src="https://shawon39.github.io/broadband-demo/"
             width="100%" height="1400" frameborder="0"></iframe>
   </apex:page>
   ```
3. In Lightning App Builder, drag the Visualforce standard component onto the target
   page and select this page.
