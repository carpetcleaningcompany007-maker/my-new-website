param(
  [Parameter(Mandatory = $true)]
  [string]$Location,

  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z0-9-]+$')]
  [string]$Slug,

  [string]$Service = 'Carpet Cleaning',
  [string]$BusinessName = 'The Carpet Cleaning Company',
  [string]$PhoneDisplay = '07802 563213',
  [string]$PhoneTel = '07802563213',
  [string]$WhatsAppNumber = '447802563213'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$pagesDir = Join-Path $repoRoot 'pages'
$sourceMain = Join-Path $pagesDir 'landing-shrewsbury.html'
$sourceQuote = Join-Path $pagesDir 'landing-shrewsbury-quote.html'
$targetMain = Join-Path $pagesDir "landing-$Slug.html"
$targetQuote = Join-Path $pagesDir "landing-$Slug-quote.html"

if ((Test-Path -LiteralPath $targetMain) -or (Test-Path -LiteralPath $targetQuote)) {
  throw "A landing-page variant for '$Slug' already exists. Choose another slug or move the existing files first."
}

function Convert-LandingPage {
  param(
    [string]$Source,
    [string]$Destination
  )

  $content = Get-Content -LiteralPath $Source -Raw

  # Protect the company name while changing the advertised service wording.
  $businessToken = '__LANDING_BUSINESS_NAME__'
  $content = $content.Replace('The Carpet Cleaning Company', $businessToken)

  # Change both page links together while deliberately retaining the existing
  # proven background-image asset filenames.
  $content = $content.Replace('landing-shrewsbury-quote.html', "landing-$Slug-quote.html")
  $content = $content.Replace('landing-shrewsbury.html', "landing-$Slug.html")
  $content = $content.Replace('Shrewsbury', $Location)

  if ($Service -ne 'Carpet Cleaning') {
    $serviceLower = $Service.ToLowerInvariant()
    $content = $content.Replace('Carpet Cleaning', $Service)
    $content = $content.Replace('carpet cleaning', $serviceLower)
  }

  $content = $content.Replace('07802 563213', $PhoneDisplay)
  $content = $content.Replace('07802563213', $PhoneTel)
  $content = $content.Replace('447802563213', $WhatsAppNumber)
  $content = $content.Replace($businessToken, $BusinessName)

  Set-Content -LiteralPath $Destination -Value $content -Encoding utf8
}

Convert-LandingPage -Source $sourceMain -Destination $targetMain
Convert-LandingPage -Source $sourceQuote -Destination $targetQuote

Write-Host "Created: pages/landing-$Slug.html"
Write-Host "Created: pages/landing-$Slug-quote.html"
Write-Host 'Both pages retain the existing CRM, Google Ads, Analytics, attribution and Google Sheets tracking.'
Write-Host 'Review the town-specific wording, photographs, review claims and service packages before publishing.'
