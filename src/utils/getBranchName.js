const getBranchName = ({ name, version }) => (
  `${name}-${version}`
    .replace(/[^a-zA-Z0-9_\-.\+]/g, '')
    .replace(/\.\.|\.lock/g, '')
    .replace(/\.$/, '')
)

export default getBranchName
