type BankFields = Record<string, string>
type CurrencyAccount = { name: string; routes: Record<string, BankFields> }

export const bankAccountHolder = "Tiles Privacy Technologies Pvt Ltd"

const bank = (name: string, address: string) => ({ "Bank name": name, "Bank address": address })
const account = (number: string) => ({ "Account number": number })

const usd = account("210506940172")
const aud = account("253974761")
const cad = account("132604625")
const nzd = account("04-2021-0441760-51")
const sgd = account("339-817-05")
const hkd = account("79680313150")

const gbBank = bank("Wise Payments Limited", "Worship Square, 65 Clifton Street, London, EC2A 4JE, United Kingdom")
const gbSwift = {
  "International SWIFT to the UK": { IBAN: "GB84 TRWI 6084 6483 5279 67", "SWIFT/BIC": "TRWIGB2LXXX", ...gbBank },
}
const hkBank = "DBS Bank (Hong Kong) Limited"
// Wise also accepts domestic USD, CNY and EUR transfers into this Hong Kong account.
const hkLocal = {
  "Local transfer in Hong Kong": { ...hkd, "Bank name": hkBank, "Bank code": "016", "Branch code": "478" },
}
const brussels = "Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium"
const eur = { IBAN: "BE33 9030 7783 2546" }
const euBank = bank("Wise Europe SA", brussels)
const huf = { IBAN: "HU92 1260 0016 1642 0213 2198 6630" }
const huBank = bank("Wise", brussels)
const nzBank = bank("Wise Payments New Zealand Ltd.", "Level 11, 41 Shortland Street, Auckland, 1010, New Zealand")
const sgBank = bank("Wise Asia-Pacific Pte. Ltd.", "2 Tanjong Katong Road, #07-01, PLQ3, Singapore, 437161, Singapore")

export const bankAccounts: Record<string, CurrencyAccount> = {
  AED: { name: "UAE dirham", routes: gbSwift },
  AUD: {
    name: "Australian dollar",
    routes: {
      "Local transfer in Australia": { "BSB code": "774-001", ...aud },
      "International SWIFT": {
        ...aud,
        "SWIFT/BIC": "TRWIAUS1XXX",
        ...bank("Wise Australia Pty Ltd", "Suite 1, Level 11, 66 Goulburn Street, Sydney, NSW, 2000, Australia"),
      },
    },
  },
  CAD: {
    name: "Canadian dollar",
    routes: {
      "Local transfer in Canada": { ...cad, "Institution number": "705", "Branch number": "00001" },
      "International SWIFT": {
        ...cad,
        "SWIFT/BIC": "TRWICAW1XXX",
        ...bank("Wise Payments Canada Inc.", "99 Bank Street, Suite 1420, Ottawa, ON, K1P 1H4, Canada"),
      },
    },
  },
  CHF: { name: "Swiss franc", routes: gbSwift },
  CNY: { name: "Chinese yuan", routes: { ...gbSwift, ...hkLocal } },
  CZK: { name: "Czech koruna", routes: gbSwift },
  DKK: { name: "Danish krone", routes: gbSwift },
  EUR: {
    name: "Euro",
    routes: {
      "Local SEPA transfer": { ...eur, ...euBank },
      ...hkLocal,
      "International SWIFT": { ...eur, "SWIFT/BIC": "TRWIBEB1XXX", ...euBank },
    },
  },
  GBP: {
    name: "British pound",
    routes: {
      "Local transfer in the UK": { ...account("83527967"), "Sort code": "60-84-64", ...gbBank },
      ...gbSwift,
    },
  },
  HKD: {
    name: "Hong Kong dollar",
    routes: {
      ...hkLocal,
      "International SWIFT": {
        ...hkd,
        "SWIFT/BIC": "DHBKHKHH",
        ...bank(hkBank, "G/F, The Center, 99 Queen's Road Central, Central, 000, Hong Kong"),
      },
    },
  },
  HUF: {
    name: "Hungarian forint",
    routes: {
      "Local transfer in Hungary": { ...account("12600016-16420213-21986630"), ...huf, ...huBank },
      "International SWIFT": { ...huf, "SWIFT/BIC": "TRWIBEBBXXX", ...huBank },
    },
  },
  ILS: { name: "Israeli new shekel", routes: gbSwift },
  JPY: { name: "Japanese yen", routes: gbSwift },
  NOK: { name: "Norwegian krone", routes: gbSwift },
  NZD: {
    name: "New Zealand dollar",
    routes: {
      "Local transfer in New Zealand": { ...nzd, ...nzBank },
      "International SWIFT": { ...nzd, "SWIFT/BIC": "TRWINZ21XXX", ...nzBank },
    },
  },
  PHP: {
    name: "Philippine peso",
    routes: {
      "Local transfer in the Philippines": {
        ...account("2012698304"),
        "Bank code / BRSTN": "01828-001-6",
        "Bank name": "Wise Pilipinas Inc.",
      },
    },
  },
  PLN: { name: "Polish złoty", routes: gbSwift },
  SEK: { name: "Swedish krona", routes: gbSwift },
  SGD: {
    name: "Singapore dollar",
    routes: {
      "Local transfer in Singapore": { "Bank code": "0516", ...sgd, ...sgBank },
      "International SWIFT": { ...sgd, "SWIFT/BIC": "TRWISGSGXXX", ...sgBank },
    },
  },
  UGX: { name: "Ugandan shilling", routes: gbSwift },
  USD: {
    name: "US dollar",
    routes: {
      "US ACH or domestic wire": {
        ...usd,
        "Routing number (wire and ACH)": "101019628",
        "Account type": "Checking",
        "Partner bank": "Lead Bank",
      },
      ...hkLocal,
      "International SWIFT": {
        ...usd,
        "SWIFT/BIC": "TRWIUS35XXX",
        ...bank("Wise US Inc", "108 W 13th St, Wilmington, DE, 19801, United States"),
      },
    },
  },
  ZAR: { name: "South African rand", routes: gbSwift },
}
