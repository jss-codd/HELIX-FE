const RenderOnRole = ({ roles, children,keyclock }) => {
    return (roles.some((role) => keyclock?.hasRealmRole(role))) ? children : null;
}

export default RenderOnRole;