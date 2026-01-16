'use client'

import { useState, useEffect } from 'react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3'
    }

    return (
        <div className={`spinner ${sizeClasses[size]} ${className}`}></div>
    )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'small' | 'medium' | 'large'
    loading?: boolean
    children: React.ReactNode
}

export const Button = ({
    variant = 'primary',
    size = 'medium',
    loading = false,
    children,
    disabled,
    className = '',
    ...props
}: ButtonProps) => {
    const baseClasses = 'btn'
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost'
    }
    const sizeClasses = {
        small: 'btn-small',
        medium: '',
        large: 'btn-large'
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner size="sm" />}
            {children}
        </button>
    )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    containerClassName?: string
}

export const Input = ({
    label,
    error,
    containerClassName = '',
    className = '',
    ...props
}: InputProps) => {
    return (
        <div className={`form-group ${containerClassName}`}>
            {label && <label className="label">{label}</label>}
            <input className={`input ${error ? 'border-error' : ''} ${className}`} {...props} />
            {error && <span className="text-error text-sm mt-1 block">{error}</span>}
        </div>
    )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: Array<{ value: string | number; label: string }>
    containerClassName?: string
}

export const Select = ({
    label,
    error,
    options,
    containerClassName = '',
    className = '',
    ...props
}: SelectProps) => {
    return (
        <div className={`form-group ${containerClassName}`}>
            {label && <label className="label">{label}</label>}
            <select className={`select ${error ? 'border-error' : ''} ${className}`} {...props}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-error text-sm mt-1 block">{error}</span>}
        </div>
    )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    containerClassName?: string
}

export const Textarea = ({
    label,
    error,
    containerClassName = '',
    className = '',
    ...props
}: TextareaProps) => {
    return (
        <div className={`form-group ${containerClassName}`}>
            {label && <label className="label">{label}</label>}
            <textarea
                className={`input resize-none ${error ? 'border-error' : ''} ${className}`}
                rows={4}
                {...props}
            />
            {error && <span className="text-error text-sm mt-1 block">{error}</span>}
        </div>
    )
}

interface CardProps {
    children: React.ReactNode
    className?: string
    title?: string
    actions?: React.ReactNode
}

export const Card = ({ children, className = '', title, actions }: CardProps) => {
    return (
        <div className={`card ${className}`}>
            {(title || actions) && (
                <div className="flex items-center justify-between mb-4">
                    {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}
                    {actions && <div className="flex items-center space-x-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    )
}

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md' }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>
            <div className={`bg-card rounded-lg shadow-xl z-10 w-full mx-4 ${maxWidthClasses[maxWidth]}`}>
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-secondary">
                        <h2 className="text-xl font-semibold text-primary">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-secondary hover:text-primary transition-fast"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

interface ToastProps {
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    onClose: () => void
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 5000)

        return () => clearTimeout(timer)
    }, [onClose])

    const typeClasses = {
        success: 'bg-success text-white',
        error: 'bg-error text-white',
        warning: 'bg-warning text-black',
        info: 'bg-info text-white'
    }

    const typeIcons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${typeClasses[type]}`}>
            <span className="text-lg">{typeIcons[type]}</span>
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-80">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    )
}

interface SearchInputProps extends Omit<InputProps, 'onChange'> {
    onSearch: (value: string) => void
    debounceMs?: number
}

export const SearchInput = ({ onSearch, debounceMs = 300, ...props }: SearchInputProps) => {
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [searchTerm, onSearch, debounceMs])

    return (
        <div className="relative">
            <Input
                {...props}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    )
}

interface EmptyStateProps {
    title: string
    description?: string
    action?: React.ReactNode
    icon?: string
}

export const EmptyState = ({ title, description, action, icon = '📭' }: EmptyStateProps) => {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
            {description && <p className="text-secondary mb-6">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    )
}
