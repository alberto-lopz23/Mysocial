import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from './Home'
import { theme } from '../../constants/theme'
import User from './User'
import Comments from './Comments'
import Share from './Share'
import Settings from './Setting'
import Search from './Search'
import ArrowLeft from './ArrowLeft'
import Mail from './Mail'
import Lock from './Lock'

const icons = {
    iconHome: Home,
    iconUser: User,
    iconComments: Comments,
    iconShare: Share,
    iconSearch: Search,
    iconSettings: Settings,
    iconArrowLeft: ArrowLeft,
    iconMail: Mail,
    iconLock: Lock,


}

const Icon = ({ name, ...props }) => {
    const IconComponent = icons[name];
    return (
        <IconComponent
            height={props.size || 24}
            width={props.size || 24}
            strokeWidth={props.strokeWidth || 2}
            color={theme.Colors.textLight}
            {...props}
        />
    )
}



export default Icon;