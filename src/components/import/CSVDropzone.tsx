"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onFile: (text: string, name: string) => void;
  isProcessing: boolean;
}

export default function CSVDropzone({ onFile, isProcessing }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
      setError("Please upload a .csv file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text?.trim()) { setError("The file appears to be empty."); return; }
      setLoaded(file.name);
      onFile(text, file.name);
    };
    reader.onerror = () => setError("Failed to read the file. Please try again.");
    reader.readAsText(file);
  }, [onFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div>
      <label
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all p-12",
          isDragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50",
          isProcessing && "pointer-events-none opacity-60"
        )}
      >
        <input type="file" accept=".csv,text/csv" className="sr-only" onChange={onInputChange} />

        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
          isDragOver ? "bg-indigo-100" : "bg-white shadow-sm"
        )}>
          {loaded && !isProcessing
            ? <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            : <Upload className={cn("h-8 w-8", isDragOver ? "text-indigo-500" : "text-gray-400")} />
          }
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-gray-700">
            {isProcessing ? "Analysing your data…"
              : loaded ? `Loaded: ${loaded}`
              : isDragOver ? "Drop your file here"
              : "Drag & drop your CSV file here"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {!isProcessing && !loaded && "or click to browse — max 10 MB"}
            {isProcessing && "Building charts, cohorts, and forecast…"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FileText className="h-3.5 w-3.5" />
          <span>CSV format · UTF-8 encoding</span>
        </div>
      </label>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
