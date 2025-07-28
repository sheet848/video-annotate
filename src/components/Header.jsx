import { MessageSquare } from 'lucide-react';

const Header = () => {
  return (
    <>
    <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '20px 0'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
      <MessageSquare size={32} color="white" />
      <h1 style={{
        color: 'white',
        margin: 0,
        fontSize: '28px',
        fontWeight: '600',
        letterSpacing: '-0.5px'
      }}>
        Video Annotator
      </h1>
    </div>
  </div>
    </>
  )
}

export default Header