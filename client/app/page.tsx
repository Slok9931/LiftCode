import React from 'react'

export default function HomePage(): React.ReactElement {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: '1rem',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(220, 38, 38, 0.3)'
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: '#a3a3a3',
    marginBottom: '3rem',
    textAlign: 'center',
    lineHeight: '1.6'
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '15px',
    padding: '3rem',
    marginBottom: '2rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    maxWidth: '800px',
    width: '100%'
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '1.2rem 2.5rem',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.1rem',
    margin: '0.5rem',
    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
  }

  return React.createElement('main', { style: containerStyle },
    React.createElement('div', { style: { textAlign: 'center' as const, width: '100%' } },
      React.createElement('h1', { style: titleStyle }, '🏋️ LiftCode'),
      React.createElement('p', { style: subtitleStyle }, 'Your Ultimate Workout Tracking Platform'),

      React.createElement('div', { style: cardStyle },
        React.createElement('h2', {
          style: {
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: '#ffffff',
            textAlign: 'center' as const
          }
        }, 'Ready to Transform Your Fitness? 🚀'),

        React.createElement('p', {
          style: {
            color: '#737373',
            fontSize: '1.2rem',
            marginBottom: '2rem',
            textAlign: 'center' as const,
            lineHeight: '1.6'
          }
        }, 'Track workouts, monitor progress, and achieve your fitness goals with our comprehensive system.'),

        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap' as const,
            gap: '1rem'
          }
        },
          React.createElement('button', { style: buttonStyle }, '🏋️ Start Your First Workout'),
          React.createElement('button', {
            style: {
              ...buttonStyle,
              backgroundColor: 'transparent',
              color: '#dc2626',
              border: '2px solid #dc2626'
            }
          }, '💪 Explore Exercises')
        )
      ),

      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: '#111111',
          borderRadius: '10px',
          border: '1px solid #262626',
          maxWidth: '800px',
          width: '100%'
        }
      },
        React.createElement('div', { style: { textAlign: 'center' as const } },
          React.createElement('div', {
            style: {
              color: '#16a34a',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginBottom: '0.5rem'
            }
          }, '✅ Backend API'),
          React.createElement('div', {
            style: { color: '#737373', fontSize: '0.9rem' }
          }, 'Ready on localhost:5000')
        ),

        React.createElement('div', { style: { textAlign: 'center' as const } },
          React.createElement('div', {
            style: {
              color: '#16a34a',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginBottom: '0.5rem'
            }
          }, '✅ Frontend'),
          React.createElement('div', {
            style: { color: '#737373', fontSize: '0.9rem' }
          }, 'Running on localhost:3000')
        ),

        React.createElement('div', { style: { textAlign: 'center' as const } },
          React.createElement('div', {
            style: {
              color: '#dc2626',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              marginBottom: '0.5rem'
            }
          }, '🎨 Dark Theme'),
          React.createElement('div', {
            style: { color: '#737373', fontSize: '0.9rem' }
          }, 'Black & Red Design')
        )
      ),

      React.createElement('footer', {
        style: {
          paddingTop: '2rem',
          borderTop: '1px solid #262626',
          color: '#737373',
          fontSize: '1rem',
          textAlign: 'center' as const,
          marginTop: '2rem'
        }
      },
        React.createElement('p', null,
          'Built with ❤️ using ',
          React.createElement('span', {
            style: { color: '#dc2626', fontWeight: '600' }
          }, 'Next.js'),
          ' + ',
          React.createElement('span', {
            style: { color: '#dc2626', fontWeight: '600' }
          }, 'Node.js')
        )
      )
    )
  )
}
