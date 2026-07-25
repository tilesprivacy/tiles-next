import { SiCircle } from "react-icons/si"

export const SPONSOR_USDC_ETH_ADDRESS =
  "0x7d6ab3dbdf510d6669e72f0e27ada61bbad0821d"

export const SPONSOR_USDC_ETHERSCAN_URL = `https://etherscan.io/address/${SPONSOR_USDC_ETH_ADDRESS}`

export function SponsorUsdcDonateButton() {
  return (
    <a
      className="minimal-secondary-button"
      href={SPONSOR_USDC_ETHERSCAN_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Donate USDC on Ethereum via Etherscan"
      title="USDC on Ethereum"
    >
      <SiCircle className="minimal-sponsor-button-icon" aria-hidden />
      Donate USDC
    </a>
  )
}
