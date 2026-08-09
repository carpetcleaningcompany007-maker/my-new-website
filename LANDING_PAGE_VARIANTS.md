# Creating another location or service landing page

The Shrewsbury landing page is a two-page funnel. Always create and publish
both generated files together.

From the repository folder, run:

```powershell
.\tools\new-landing-variant.ps1 -Location 'Ludlow' -Slug 'ludlow'
```

To make a page for another service:

```powershell
.\tools\new-landing-variant.ps1 `
  -Location 'Shrewsbury' `
  -Slug 'shrewsbury-upholstery' `
  -Service 'Upholstery Cleaning'
```

Optional settings allow the company name and telephone details to be changed:

```powershell
.\tools\new-landing-variant.ps1 `
  -Location 'Example Town' `
  -Slug 'example-town' `
  -Service 'Carpet Cleaning' `
  -BusinessName 'The Carpet Cleaning Company' `
  -PhoneDisplay '07802 563213' `
  -PhoneTel '07802563213' `
  -WhatsAppNumber '447802563213'
```

The generator automatically updates:

- the location and advertised service;
- both page filenames and links between the steps;
- title, description, canonical link and enquiry subject;
- CRM and Google Sheets landing-page attribution;
- Google Analytics and Google Ads event location;
- telephone, SMS and WhatsApp links;
- the final quote page and its back link.

It deliberately retains the established design and existing background asset
filenames. Before publishing a new variant, review its photographs, local
claims, reviews, packages and service wording. Do not publish claims that are
not accurate for that location or service.
