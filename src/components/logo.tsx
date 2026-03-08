import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { width: 140, height: 32, padding: 'px-4 py-2' },
  md: { width: 180, height: 40, padding: 'px-5 py-2.5' },
  lg: { width: 240, height: 54, padding: 'px-6 py-3' },
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const { width, height, padding } = sizes[size]

  return (
    <div className={`inline-flex items-center justify-center bg-white rounded-full shadow-md ${padding} ${className}`}>
      <Image
        src="/logo.png"
        alt="Sunday Run"
        width={width}
        height={height}
        priority
        style={{ width: 'auto', height: 'auto', maxWidth: width, maxHeight: height }}
      />
    </div>
  )
}
