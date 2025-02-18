import Image from "next/image";
import styled from "styled-components";

const HeaderContainer = styled.header`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  background: white;
  width: 100%;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  position: relative;
  height: 32px;

  @media (min-width: 768px) {
    height: 40px;
  }
`;

const MobileLogo = styled(Image)`
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`;

const DesktopLogo = styled(Image)`
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <MobileLogo
            src="/Group 30.png"
            alt="VideoNotes Logo"
            width={105}
            height={32}
            priority
          />
          <DesktopLogo
            src="/Logo.png"
            alt="VideoNotes Logo"
            width={130}
            height={40}
            priority
          />
        </LogoContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 