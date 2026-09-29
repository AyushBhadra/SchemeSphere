export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

export const OCCUPATIONS = [
  'Farmer',
  'Student',
  'Self-employed',
  'Micro entrepreneur',
  'Small business owner',
  'Artisan',
  'Carpenter',
  'Blacksmith',
  'Goldsmith',
  'Potter',
  'Tailor',
  'Mason',
  'Cobbler',
  'Barber',
  'Salaried employee',
  'Unemployed',
  'Homemaker',
  'Retired',
]

export const CASTE_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS']

export const SCHEME_CATEGORIES = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Financial',
  'Housing',
]

export function localizedField(scheme, field, language) {
  if (!scheme) return ''
  const hindiKey = `${field}Hindi`
  if (language === 'hi' && scheme[hindiKey]) return scheme[hindiKey]
  return scheme[field] || ''
}
