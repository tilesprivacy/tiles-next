/** @type {import('nextra').ThemeConfig} */
export default {
  copyPageButton: true,
  gitTimestamp: ({ timestamp }) => {
    if (!timestamp) return null
    return (
      <>Last updated: {new Date(timestamp).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</>
    )
  },
}
