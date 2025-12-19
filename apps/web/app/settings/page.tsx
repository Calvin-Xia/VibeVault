'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AppShell from '@/components/AppShell'
import { exportData } from '@/server-actions/export-data'
import { importData } from '@/server-actions/import-data'

export default function SettingsPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResults, setImportResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handleExport = async () => {
    setIsExporting(true)
    setError(null)
    
    try {
      const data = await exportData()
      
      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vibevault-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to export data: ' + (err as Error).message)
      console.error('Export error:', err)
    } finally {
      setIsExporting(false)
    }
  }
  
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!importFile) {
      setError('Please select a file to import')
      return
    }
    
    setIsImporting(true)
    setError(null)
    setImportResults(null)
    
    try {
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          const jsonData = event.target?.result as string
          const results = await importData(jsonData)
          setImportResults(results)
        } catch (err) {
          setError('Failed to import data: ' + (err as Error).message)
          console.error('Import error:', err)
        } finally {
          setIsImporting(false)
        }
      }
      
      reader.readAsText(importFile)
    } catch (err) {
      setError('Failed to read file: ' + (err as Error).message)
      console.error('File read error:', err)
      setIsImporting(false)
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImportFile(file)
      setError(null)
    }
  }
  
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your VibeVault account and data</p>
          </div>
          
          {/* Import/Export Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Import/Export Data</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Export */}
              <div className="space-y-4">
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-gray-600">
                  Export your links, tags, and collections to a JSON file
                </p>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
              
              {/* Import */}
              <div className="space-y-4">
                <h3 className="font-medium">Import Data</h3>
                <p className="text-sm text-gray-600">
                  Import your previously exported data from a JSON file
                </p>
                
                <form onSubmit={handleImport} className="space-y-3">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    disabled={isImporting}
                    className="w-full px-3 py-2 border rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <button
                    type="submit"
                    disabled={isImporting || !importFile}
                    className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </button>
                </form>
              </div>
            </div>
            
            {/* Import Results */}
            {importResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <h3 className="font-medium text-green-800">Import Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Imported Links</div>
                    <div className="font-semibold text-green-700">{importResults.importedLinks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Skipped Links</div>
                    <div className="font-semibold text-gray-700">{importResults.skippedLinks}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Imported Tags</div>
                    <div className="font-semibold text-green-700">{importResults.importedTags}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Skipped Tags</div>
                    <div className="font-semibold text-gray-700">{importResults.skippedTags}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Imported Collections</div>
                    <div className="font-semibold text-green-700">{importResults.importedCollections}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Skipped Collections</div>
                    <div className="font-semibold text-gray-700">{importResults.skippedCollections}</div>
                  </div>
                </div>
                
                {importResults.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-sm font-medium text-red-800">Errors</div>
                    <ul className="text-xs text-red-700 mt-2 space-y-1">
                      {importResults.errors.map((err: string, index: number) => (
                        <li key={index}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
              >
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
