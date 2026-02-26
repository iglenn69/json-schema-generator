/**
 * Enriches a JSON Schema by injecting `faker` annotations and standard `format`
 * values inferred from property names, so realistic data is generated even when
 * the original schema has no hints beyond type.
 *
 * Rules are applied only where the property does NOT already have a `faker` or
 * `format` annotation — existing annotations are always preserved.
 */

interface SchemaNode {
  type?: string | string[];
  format?: string;
  faker?: string;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  prefixItems?: SchemaNode[];
  allOf?: SchemaNode[];
  anyOf?: SchemaNode[];
  oneOf?: SchemaNode[];
  then?: SchemaNode;
  else?: SchemaNode;
  [key: string]: unknown;
}

// ── String / format rules (matched against lower-cased property name) ────────

type StringRule = { faker: string } | { format: string };

const STRING_RULES: [RegExp, StringRule][] = [
  // Identity
  [/\buuid\b/, { format: 'uuid' }],

  // Person
  [/\b(full[_-]?name|display[_-]?name)\b/, { faker: 'person.fullName' }],
  [/\b(first[_-]?name|givenname|forename)\b/, { faker: 'person.firstName' }],
  [/\b(last[_-]?name|surname|familyname)\b/, { faker: 'person.lastName' }],
  [/\b(job[_-]?title|position|occupation|role)\b/, { faker: 'person.jobTitle' }],
  [/\bgender\b/, { faker: 'person.gender' }],
  [/\b(prefix|salutation)\b/, { faker: 'person.prefix' }],
  [/\bsuffix\b/, { faker: 'person.suffix' }],

  // Contact
  [/\bemail\b/, { faker: 'internet.email' }],
  [/\b(phone|mobile|tel|cell)([_-]?number|no)?\b/, { faker: 'phone.number' }],

  // Internet
  [/\b(username|user[_-]?name|handle|login)\b/, { faker: 'internet.username' }],
  [/\bpassword\b/, { faker: 'internet.password' }],
  [/\b(url|website|homepage|site|link|href)\b/, { faker: 'internet.url' }],
  [/\b(avatar|profile[_-]?(pic|image|photo)|photo)\b/, { faker: 'internet.avatar' }],
  [/\b(ip[_-]?address|ipv4)\b/, { faker: 'internet.ip' }],
  [/\bipv6\b/, { faker: 'internet.ipv6' }],
  [/\buser[_-]?agent\b/, { faker: 'internet.userAgent' }],
  [/\b(domain|hostname)\b/, { faker: 'internet.domainName' }],
  [/\b(mac[_-]?address)\b/, { faker: 'internet.mac' }],

  // Location
  [/\b(street[_-]?(address|name)?|address[_-]?(line)?1?)\b/, { faker: 'location.streetAddress' }],
  [/\bcity\b/, { faker: 'location.city' }],
  [/\b(state|province|region)\b/, { faker: 'location.state' }],
  [/\bcountry\b/, { faker: 'location.country' }],
  [/\b(zip|postal|post[_-]?code|zip[_-]?code)\b/, { faker: 'location.zipCode' }],
  [/\b(county|district)\b/, { faker: 'location.county' }],
  [/\btimezone\b/, { faker: 'location.timeZone' }],
  [/\b(latitude|lat)\b/, { faker: 'location.latitude' }],
  [/\b(longitude|lon|lng)\b/, { faker: 'location.longitude' }],

  // Company / finance
  [/\b(company|organisation|organization|employer)\b/, { faker: 'company.name' }],
  [/\b(department|division|team)\b/, { faker: 'commerce.department' }],
  [/\b(product[_-]?name|product)\b/, { faker: 'commerce.productName' }],
  [/\b(category)\b/, { faker: 'commerce.department' }],
  [/\b(currency[_-]?code)\b/, { faker: 'finance.currencyCode' }],
  [/\b(currency[_-]?name)\b/, { faker: 'finance.currencyName' }],
  [/\biban\b/, { faker: 'finance.iban' }],
  [/\bbic\b/, { faker: 'finance.bic' }],
  [/\b(credit[_-]?card|card[_-]?number)\b/, { faker: 'finance.creditCardNumber' }],
  [/\b(account[_-]?number)\b/, { faker: 'finance.accountNumber' }],

  // Dates & times (inject format rather than faker so AJV validation stays clean)
  [/\b(created[_-]?at|creation[_-]?date|date[_-]?created)\b/, { format: 'date-time' }],
  [/\b(updated[_-]?at|modified[_-]?at|last[_-]?modified|date[_-]?modified)\b/, { format: 'date-time' }],
  [/\b(deleted[_-]?at|removed[_-]?at)\b/, { format: 'date-time' }],
  [/\b(published[_-]?at|released[_-]?at|scheduled[_-]?at)\b/, { format: 'date-time' }],
  [/\b(expires[_-]?at|expiry|expiration[_-]?date|expiry[_-]?date)\b/, { format: 'date-time' }],
  [/\btimestamp\b/, { format: 'date-time' }],
  [/\b(date[_-]?time|datetime)\b/, { format: 'date-time' }],
  [/\b(birth[_-]?date|dob|date[_-]?of[_-]?birth|birthday)\b/, { format: 'date' }],
  [/\b(start[_-]?date|end[_-]?date|due[_-]?date|date)\b/, { format: 'date' }],
  [/\b(start[_-]?time|end[_-]?time|time)\b/, { format: 'time' }],

  // Content / text
  [/\b(description|bio|about|summary|overview)\b/, { faker: 'lorem.paragraph' }],
  [/\b(content|body|text|post|article|message|comment|note|notes)\b/, { faker: 'lorem.paragraphs' }],
  [/\b(title|headline|subject|heading)\b/, { faker: 'lorem.sentence' }],
  [/\bslug\b/, { faker: 'helpers.slugify' }],
  [/\b(tag|label|keyword)\b/, { faker: 'word.noun' }],
  [/\bcolor\b/, { faker: 'color.human' }],

  // File / media
  [/\b(file[_-]?name|filename)\b/, { faker: 'system.fileName' }],
  [/\b(mime[_-]?type|content[_-]?type)\b/, { faker: 'system.mimeType' }],
  [/\b(image[_-]?url|thumbnail)\b/, { faker: 'image.url' }],
];

// ── Numeric range hints (applied when no minimum/maximum set) ────────────────

type NumericHint = { minimum?: number; maximum?: number; multipleOf?: number };

const NUMERIC_RULES: [RegExp, NumericHint][] = [
  [/\bage\b/, { minimum: 1, maximum: 120 }],
  [/\b(price|cost|amount|total|subtotal|fee|salary|wage)\b/, { minimum: 0.01, maximum: 99999.99 }],
  [/\b(rating|score|stars)\b/, { minimum: 1, maximum: 5 }],
  [/\b(percentage|percent|rate)\b/, { minimum: 0, maximum: 100 }],
  [/\b(quantity|qty|count|stock|inventory)\b/, { minimum: 0, maximum: 1000 }],
  [/\b(latitude|lat)\b/, { minimum: -90, maximum: 90 }],
  [/\b(longitude|lon|lng)\b/, { minimum: -180, maximum: 180 }],
  [/\bport\b/, { minimum: 1024, maximum: 65535 }],
  [/\b(year)\b/, { minimum: 1900, maximum: 2100 }],
  [/\b(month)\b/, { minimum: 1, maximum: 12 }],
  [/\b(day)\b/, { minimum: 1, maximum: 31 }],
  [/\b(hour)\b/, { minimum: 0, maximum: 23 }],
  [/\b(minute|second)\b/, { minimum: 0, maximum: 59 }],
  [/\b(width|height|size|dimension)\b/, { minimum: 1, maximum: 4096 }],
  [/\b(weight)\b/, { minimum: 0.1, maximum: 500 }],
  [/\b(priority|order|rank)\b/, { minimum: 1, maximum: 10 }],
];

// ── Core enrichment logic ────────────────────────────────────────────────────

function normalise(name: string): string {
  return name.toLowerCase().replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

function enrichProperty(name: string, node: SchemaNode): SchemaNode {
  const key = normalise(name);
  const types = Array.isArray(node.type) ? node.type : node.type ? [node.type] : [];

  const isString = types.includes('string') || types.length === 0;
  const isNumeric = types.includes('number') || types.includes('integer');

  const copy: SchemaNode = { ...node };

  // String enrichment
  if (isString && !copy.faker && !copy.format && !copy.enum && !copy.const) {
    for (const [pattern, rule] of STRING_RULES) {
      if (pattern.test(key)) {
        Object.assign(copy, rule);
        break;
      }
    }
  }

  // Numeric enrichment
  if (isNumeric && copy.minimum === undefined && copy.maximum === undefined) {
    for (const [pattern, hint] of NUMERIC_RULES) {
      if (pattern.test(key)) {
        if (hint.minimum !== undefined) copy.minimum = hint.minimum;
        if (hint.maximum !== undefined) copy.maximum = hint.maximum;
        if (hint.multipleOf !== undefined) copy.multipleOf = hint.multipleOf;
        break;
      }
    }
  }

  return copy;
}

export function enrichSchema(schema: unknown): unknown {
  if (typeof schema !== 'object' || schema === null) return schema;

  // Deep clone to avoid mutating the original
  const node = JSON.parse(JSON.stringify(schema)) as SchemaNode;
  return walkNode(node, null);
}

function walkNode(node: SchemaNode, propertyName: string | null): SchemaNode {
  let result: SchemaNode = { ...node };

  // Enrich this node if we know its property name
  if (propertyName !== null) {
    result = enrichProperty(propertyName, result);
  }

  // Recurse into properties
  if (result.properties && typeof result.properties === 'object') {
    const enrichedProps: Record<string, SchemaNode> = {};
    for (const [k, v] of Object.entries(result.properties)) {
      enrichedProps[k] = walkNode(v as SchemaNode, k);
    }
    result.properties = enrichedProps;
  }

  // Recurse into array items
  if (result.items && typeof result.items === 'object') {
    result.items = walkNode(result.items as SchemaNode, propertyName);
  }

  if (Array.isArray(result.prefixItems)) {
    result.prefixItems = result.prefixItems.map((s) => walkNode(s, null));
  }

  // Recurse into combiners
  for (const key of ['allOf', 'anyOf', 'oneOf'] as const) {
    if (Array.isArray(result[key])) {
      (result as Record<string, unknown>)[key] = (result[key] as SchemaNode[]).map((s) =>
        walkNode(s, null)
      );
    }
  }

  for (const key of ['then', 'else'] as const) {
    if (result[key] && typeof result[key] === 'object') {
      result[key] = walkNode(result[key] as SchemaNode, null);
    }
  }

  return result;
}
