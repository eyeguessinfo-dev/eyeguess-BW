// pages/admin/acceptances.jsx
'use client'
import { useState, useEffect } from 'react'

export default function AcceptancesAdmin() {
  const [acceptances, setAcceptances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAcceptances()
  }, [])

  const fetchAcceptances = async () => {
    try {
      const response = await fetch('/api/get-acceptances')
      const data = await response.json()
      setAcceptances(data)
    } catch (error) {
      console.error('Failed to fetch acceptances:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Package', 'Accepted At', 'IP Address']
    const csvData = acceptances.map(acc => [
      acc.id,
      `"${acc.clientName}"`,
      `"${acc.clientEmail}"`,
      `"${acc.selectedPackage}"`,
      `"${new Date(acc.acceptedAt).toLocaleString()}"`,
      `"${acc.ip}"`
    ])
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `terms-acceptances-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-xl">Loading acceptances...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Terms Acceptances</h1>
            <p className="text-gray-600 mt-2">
              {acceptances.length} total acceptance{acceptances.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={acceptances.length === 0}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {acceptances.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accepted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acceptances.map((acceptance) => (
                    <tr key={acceptance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {acceptance.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {acceptance.clientEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {acceptance.selectedPackage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(acceptance.acceptedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {acceptance.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No acceptances yet</h3>
              <p className="text-gray-500">Customer terms acceptances will appear here once they start using your service.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}