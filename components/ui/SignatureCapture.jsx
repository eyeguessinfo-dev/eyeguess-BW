'use client'
import { useRef, useState } from 'react'

export default function SignatureCapture({ onSignatureSave, onCancel }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    const signatureData = canvas.toDataURL()
    onSignatureSave(signatureData)
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="border border-gray-300 w-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex justify-between mt-4">
        <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={saveSignature} className="px-4 py-2 bg-blue-600 text-white rounded">
          Accept & Continue to Payment
        </button>
      </div>
    </div>
  )
}