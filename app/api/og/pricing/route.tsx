import { ImageResponse } from "@vercel/og"
import { TilesOgLogo } from "@/components/tiles-og-logo"
import {
  PRICING_PAGE_DESCRIPTION,
  PRICING_PAGE_TITLE,
  PRICING_PLANS,
} from "@/lib/pricing-plans"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#050505",
          color: "#F4F4F5",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          padding: "54px 58px 48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            width: "100%",
            height: 6,
            background:
              "linear-gradient(90deg, #CB30E0 0%, #7E35D7 58%, #050505 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -330,
            right: -230,
            display: "flex",
            width: 680,
            height: 680,
            border: "1px solid rgba(203, 48, 224, 0.22)",
            borderRadius: 680,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -250,
            right: -150,
            display: "flex",
            width: 520,
            height: 520,
            border: "1px solid rgba(203, 48, 224, 0.14)",
            borderRadius: 520,
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <TilesOgLogo size={48} />
            <div
              style={{
                display: "flex",
                marginLeft: 16,
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: "-0.04em",
              }}
            >
              Tiles
            </div>
          </div>
          <div
            style={{
              display: "flex",
              color: "rgba(244, 244, 245, 0.56)",
              fontSize: 20,
              letterSpacing: "-0.01em",
            }}
          >
            tiles.run/pricing
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            flex: 1,
            alignItems: "center",
            marginTop: 34,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "36%",
              flexDirection: "column",
              paddingRight: 40,
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#D964E8",
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {PRICING_PAGE_TITLE}
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 420,
                marginTop: 18,
                fontSize: 62,
                fontWeight: 600,
                letterSpacing: "-0.055em",
                lineHeight: 1.02,
              }}
            >
              Local AI stays free.
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 420,
                marginTop: 22,
                color: "rgba(244, 244, 245, 0.68)",
                fontSize: 23,
                lineHeight: 1.38,
                letterSpacing: "-0.015em",
              }}
            >
              {PRICING_PAGE_DESCRIPTION}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "64%",
              alignItems: "stretch",
            }}
          >
            {PRICING_PLANS.map((plan, index) => (
              <div
                key={plan.id}
                style={{
                  position: "relative",
                  display: "flex",
                  flex: 1,
                  minHeight: 326,
                  flexDirection: "column",
                  overflow: "hidden",
                  marginLeft: index === 0 ? 0 : 14,
                  border: plan.highlighted
                    ? "1px solid rgba(255, 255, 255, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: 20,
                  background: plan.highlighted
                    ? "linear-gradient(145deg, rgba(203, 48, 224, 0.15), rgba(255, 255, 255, 0.07))"
                    : "rgba(255, 255, 255, 0.035)",
                  padding: "22px 20px 20px",
                }}
              >
                {plan.highlighted ? (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "flex",
                      width: "100%",
                      height: 4,
                      backgroundColor: "#CB30E0",
                    }}
                  />
                ) : null}
                <div
                  style={{
                    display: "flex",
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    marginTop: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: 46,
                      fontWeight: 500,
                      letterSpacing: "-0.055em",
                      lineHeight: 1,
                    }}
                  >
                    {plan.price}
                  </div>
                  {plan.cadence ? (
                    <div
                      style={{
                        display: "flex",
                        marginLeft: 3,
                        color: "rgba(244, 244, 245, 0.52)",
                        fontSize: 15,
                      }}
                    >
                      {plan.cadence}
                    </div>
                  ) : null}
                </div>
                <div
                  style={{
                    display: "flex",
                    minHeight: 72,
                    marginTop: 16,
                    color: "rgba(244, 244, 245, 0.64)",
                    fontSize: 16,
                    lineHeight: 1.35,
                  }}
                >
                  {plan.tagline}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 22,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      color: "rgba(244, 244, 245, 0.4)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {plan.featuresIntro ?? "\u00A0"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginTop: 10,
                      color: "rgba(244, 244, 245, 0.88)",
                      fontSize: 15,
                      lineHeight: 1.32,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: 6,
                        height: 6,
                        flexShrink: 0,
                        marginTop: 7,
                        marginRight: 8,
                        borderRadius: 6,
                        backgroundColor: plan.highlighted
                          ? "#CB30E0"
                          : "rgba(244, 244, 245, 0.7)",
                      }}
                    />
                    <div style={{ display: "flex" }}>
                      {plan.features[0]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "rgba(244, 244, 245, 0.5)",
            fontSize: 17,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 8,
              height: 8,
              marginRight: 11,
              borderRadius: 8,
              backgroundColor: "#CB30E0",
            }}
          />
          Everything on your hardware stays free, without limits.
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}
