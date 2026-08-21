import { BiMenuAltRight } from 'react-icons/bi'
import OnClickBtn from './onClickbtn'
import './topSideBar.css'

type TopSideBarProps = {
  onMenuClick: () => void
}

export default function TopSideBar({ onMenuClick }: TopSideBarProps) {
  return (
    <header className="top-sidebar">
      <div className="top-sidebar-brand-wrap">
        <h1 className="top-sidebar-title"><a href="/">Planify</a></h1>
      </div>

      <div className="top-sidebar-menu-btn">
        <OnClickBtn
          color="#000"
          label="Menu"
          icon={<BiMenuAltRight size={18} />}
          onClick={onMenuClick}
          bgColor=""
        />
      </div>
    </header>
  )
}

