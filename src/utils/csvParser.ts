import { RawSaleRecord, DatasetMeta } from '../types';

export interface ParseResult {
  records: RawSaleRecord[];
  meta: DatasetMeta;
}

const REQUIRED_FIELDS = ['order_id', 'order_date', 'product_name', 'category', 'quantity', 'unit_price'];

export function parseCSVData(csvText: string, fileName: string): ParseResult {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return {
      records: [],
      meta: {
        sourceName: fileName,
        isDemo: false,
        totalRecords: 0,
        detectedColumns: [],
        dateRange: { start: '-', end: '-' },
        validationStatus: 'invalid',
        validationMessage: 'File is empty or contains no data rows.',
        missingRequiredCols: REQUIRED_FIELDS,
      },
    };
  }

  // Parse header
  const headerLine = lines[0];
  // Simple CSV split handling quotes
  const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().trim().replace(/['"]/g, ''));

  const missing = REQUIRED_FIELDS.filter((req) => !headers.includes(req));

  const records: RawSaleRecord[] = [];
  const validDates: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((hdr, idx) => {
      rowObj[hdr] = values[idx]?.trim() || '';
    });

    const orderId = rowObj['order_id'] || `REC-${i}`;
    const orderDate = rowObj['order_date'] || new Date().toISOString().split('T')[0];
    const productName = rowObj['product_name'] || 'Unlabeled Product';
    const category = rowObj['category'] || 'General';
    const quantity = parseFloat(rowObj['quantity']) || 1;
    const unitPrice = parseFloat(rowObj['unit_price']) || 0;

    validDates.push(orderDate);

    records.push({
      order_id: orderId,
      order_date: orderDate,
      product_name: productName,
      category,
      quantity,
      unit_price: unitPrice,
      customer_id: rowObj['customer_id'] || undefined,
      region: rowObj['region'] || undefined,
    });
  }

  // Determine date range
  validDates.sort();
  const start = validDates[0] || '-';
  const end = validDates[validDates.length - 1] || '-';

  const status: DatasetMeta['validationStatus'] =
    missing.length === 0 ? 'valid' : missing.length <= 2 ? 'warning' : 'invalid';

  let validationMsg = 'All required columns detected and validated.';
  if (missing.length > 0) {
    validationMsg = `Missing recommended columns: ${missing.join(', ')}. Default fallbacks applied.`;
  }

  return {
    records,
    meta: {
      sourceName: fileName,
      isDemo: false,
      totalRecords: records.length,
      detectedColumns: headers,
      dateRange: { start, end },
      validationStatus: status,
      validationMessage: validationMsg,
      missingRequiredCols: missing,
    },
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let cur = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}
