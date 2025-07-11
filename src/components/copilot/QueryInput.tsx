import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Calculator, BarChart3, Filter } from 'lucide-react'

interface QueryInputProps {
  onQuery: (query: string, type: 'formula' | 'analysis' | 'cleanup') => void
}

export function QueryInput({ onQuery }: QueryInputProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (type: 'formula' | 'analysis' | 'cleanup') => {
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      await onQuery(query, type)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      type: 'formula' as const,
      title: 'Generate Formula',
      description: 'Create Excel formulas from natural language',
      icon: Calculator,
      examples: ['Sum all values in column A', 'Find average of last 10 rows', 'Count unique values']
    },
    {
      type: 'analysis' as const,
      title: 'Data Analysis',
      description: 'Analyze patterns and insights in your data',
      icon: BarChart3,
      examples: ['Show trends in sales data', 'Find outliers', 'Calculate growth rate']
    },
    {
      type: 'cleanup' as const,
      title: 'Clean Data',
      description: 'Remove duplicates and format data',
      icon: Filter,
      examples: ['Remove empty rows', 'Format as currency', 'Split full names']
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-excel-green">
            <Sparkles className="h-5 w-5" />
            Ask AI Copilot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you want to do with your spreadsheet..."
            className="min-h-[100px] resize-none"
          />
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleSubmit('formula')}
              disabled={!query.trim() || isLoading}
              className="flex-1 bg-excel-green hover:bg-excel-green-light"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Generate Formula
            </Button>
            <Button
              onClick={() => handleSubmit('analysis')}
              disabled={!query.trim() || isLoading}
              variant="outline"
              className="flex-1"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analyze Data
            </Button>
            <Button
              onClick={() => handleSubmit('cleanup')}
              disabled={!query.trim() || isLoading}
              variant="outline"
              className="flex-1"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clean Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card key={action.type} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className="h-4 w-4 text-excel-green" />
                  {action.title}
                </CardTitle>
                <p className="text-xs text-gray-600">{action.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {action.examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(example)}
                      className="block w-full text-left text-xs text-gray-500 hover:text-excel-green hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}