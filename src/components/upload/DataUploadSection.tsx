import React, { useRef, useState } from 'react';
import { DatasetMeta, RawSaleRecord } from '../../types';
import { parseCSVData } from '../../utils/csvParser';
import { SAMPLE_CSV_TEMPLATE } from '../../data/csvTemplate';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';

interface DataUploadSectionProps {
  currentMeta: DatasetMeta;
  onDatasetChange: (records: RawSaleRecord[], meta: DatasetMeta) => void;
  onNavigateToDashboard?: () => void;
}

export const DataUploadSection: React.FC<DataUploadSectionProps> = ({
  currentMeta,
  onDatasetChange,
  onNavigateToDashboard,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setNotification('Please upload a standard .csv spreadsheet file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const { records, meta } = parseCSVData(text, file.name);
        onDatasetChange(records, meta);
        setNotification(`Successfully parsed ${records.length} orders from ${file.name}`);
        setTimeout(() => setNotification(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'retaillens_sales_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasData = currentMeta.totalRecords > 0 && Boolean(currentMeta.sourceName);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Connect your store data
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload your store's historical sales ledger in CSV format to populate analytics and AI insights.
        </p>
      </div>

      {notification && (
        <div className="p-3.5 bg-slate-900 text-white text-xs rounded-lg flex items-center justify-between shadow-sm border border-slate-800">
          <span>{notification}</span>
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
      )}

      {/* Upload Box and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition cursor-pointer flex flex-col items-center justify-center ${
              dragActive
                ? 'border-indigo-600 bg-indigo-50/40'
                : 'border-slate-300 hover:border-slate-400 bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3 shadow-xs">
              <UploadCloud className="w-6 h-6 text-indigo-600" />
            </div>

            <h3 className="text-sm font-semibold text-slate-900">
              Drag & drop your store sales CSV here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Supports exported order CSV files from Shopify, WooCommerce, Amazon, or custom ERP systems.
            </p>

            <div className="mt-5 flex items-center justify-center">
              <button
                type="button"
                id="upload-sales-data-btn"
                className="px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer inline-flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Sales Data (CSV)</span>
              </button>
            </div>
          </div>

          {/* Expected CSV Schema */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Expected CSV Format
                </h4>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-1.5">
                  Required Fields:
                </span>
                <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
                  <li>• order_id <span className="text-slate-400">(unique string)</span></li>
                  <li>• order_date <span className="text-slate-400">(YYYY-MM-DD)</span></li>
                  <li>• product_name <span className="text-slate-400">(string)</span></li>
                  <li>• category <span className="text-slate-400">(string)</span></li>
                  <li>• quantity <span className="text-slate-400">(positive integer)</span></li>
                  <li>• unit_price <span className="text-slate-400">(currency number)</span></li>
                </ul>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-1.5">
                  Optional Fields:
                </span>
                <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
                  <li>• customer_id <span className="text-slate-400">(string)</span></li>
                  <li>• region <span className="text-slate-400">(string)</span></li>
                </ul>
                <p className="text-slate-400 text-[11px] mt-2 font-sans">
                  Total price will be computed deterministically as quantity &times; unit_price.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Dataset Status */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Active Dataset
                  </h4>
                </div>
                {hasData ? (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      currentMeta.validationStatus === 'valid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : currentMeta.validationStatus === 'warning'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {currentMeta.validationStatus === 'valid' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {currentMeta.validationStatus === 'valid' ? 'Validated Schema' : 'Check Schema'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Not Connected
                  </span>
                )}
              </div>

              {hasData ? (
                <div className="mt-4 space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Uploaded File Name</span>
                    <span className="font-semibold text-slate-900 truncate block mt-0.5">
                      {currentMeta.sourceName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Total Records</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">
                        {currentMeta.totalRecords.toLocaleString()} rows
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Date Range</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block text-[11px]">
                        {currentMeta.dateRange.start} &rarr; {currentMeta.dateRange.end}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1.5">Detected Columns</span>
                    <div className="flex flex-wrap gap-1">
                      {currentMeta.detectedColumns.map((col) => (
                        <span
                          key={col}
                          className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                    {currentMeta.validationMessage}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <Database className="w-6 h-6" />
                  </div>
                  <h5 className="font-semibold text-slate-800 text-sm">No dataset connected</h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Upload your store sales data in CSV format to populate the dashboard and unlock AI analytics.
                  </p>
                </div>
              )}
            </div>

            {hasData && onNavigateToDashboard && (
              <div className="pt-5 mt-5 border-t border-slate-100">
                <button
                  onClick={onNavigateToDashboard}
                  className="w-full py-2.5 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <span>Explore in Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
