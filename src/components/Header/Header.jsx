// src/components/Header/Header.jsx (CORRIGIDO)

import StaggeredMenu from '../StaggeredMenu';
import { Link as ScrollLink } from 'react-scroll';

const menuItems = [
    { label: 'Início', ariaLabel: 'Rolar para Início', link: 'inicio' },
    { label: 'Sobre Nós', ariaLabel: 'Rolar para Sobre Nós', link: 'sobre-nos' },
    { label: 'Roadmap', ariaLabel: 'Rolar para Roadmap', link: 'roadmap' },
    { label: 'Inovação', ariaLabel: 'Rolar para Inovação', link: 'inovacao' },
    { label: 'Contato', ariaLabel: 'Rolar para Contato', link: 'contato' }
];

const socialItems = [
    { label: 'GitHub', link: 'https://github.com/FeCocco/e-move-frontend.git' },
];

const CustomMenuItem = ({ children, href, ...props }) => (
    <ScrollLink
        to={href}
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        {...props}
    >
        {children}
    </ScrollLink>
);

export default function Header() {
    return (
        <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#fff"
            // Cor do botão "Close" alterada para branco
            openMenuButtonColor="#fff"
            changeMenuColorOnOpen={true}
            // Cores da animação alteradas para tons escuros
            colors={['#1e293b', '#0f172a']}
            accentColor="hsl(var(--verde-claro))"
            onMenuOpen={() => console.log('Menu opened')}
            onMenuClose={() => console.log('Menu closed')}
            itemComponent={CustomMenuItem}
        />
    );
}