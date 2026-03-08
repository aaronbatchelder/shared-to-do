import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { width: 150, height: 50, padding: 'px-5 py-2.5' },
  md: { width: 200, height: 67, padding: 'px-6 py-3' },
  lg: { width: 270, height: 90, padding: 'px-8 py-4' },
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
