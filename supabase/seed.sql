-- ============================================
-- SEED DATA - Initial Products
-- ============================================
-- Execute this AFTER schema.sql

-- Insert current products from your website
INSERT INTO products (
    slug,
    title,
    description,
    price,
    original_price,
    renewable_price,
    image,
    thumbnails,
    category,
    seller,
    badge,
    rating,
    review_count,
    in_stock,
    stock_quantity,
    features
) VALUES
(
    'windows-11-pro',
    'Windows 11 Pro Key',
    'Complete protection for your digital life. Includes antivirus, VPN, and password manager for up to 5 devices.',
    3.95,
    4.93,
    0.26,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDE2Bm5_mxZP4XTmm_DToRTt8-5c6IPyVXn98aTPwwnY-ufje5JEUvB5kWfOc2czCNYkaU7nMHoyIp0D6g6eYr2mwai4Lu6CAmrt1i-2OnsMUt27D9yaBEbsGEARfTcS6LCkBHJtvGkJI8CTcpQxBvNV0_F8ihDQd5Zaqco70RE_cg6y7K-AH5Nf8pbVizA8ePouTmTrgha_CptChAVtyhQ7k3-1NXXY-Bdc8s90vZh_d2HsWlLpTfWxqs2Vm05qv0esO9CRLZzbQ',
    ARRAY[
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCbTMdLLO3fjMoB3eAqMq_Q0cUN2IkmqkRT5ipudtmKTrnuyxhV1dqafa6Ni2hop2svM0cNZXY3d6Kwks32VpvAOUgpz9YfiZndNeUVa5_CLTowoKU6dMMzZjTY8CG9rryyjZNnD56tZOoPACeZJAcVmFe3-8rZvdp6DpRDsijXUBh16Nf1kUqCBtOtwln5E76wWFpqN8N0nsPzvZN2RqFbbBD61kTzrQWlQiHCgeH1-QLnz5Ka-N4eF36uCxvDd8-15B0roBsNxQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCavJ4UxTiCFpBLG8J78EQ4sJoWP2AwHc3bUqLRX5pav4kKFQAFY_fo377_0Cz0KOeNILIVTbgWNDCTEmfO4pkA0AYQbY9b4KDb273ZzMMwD1Lwgq-TQUNwcSNudNqRHZC0L6Z02vumuxuM-yaMvR0gTlsYx5QsrdSrtSEcsBwW7bfILPNhaBC-aq3zV7kctsNotyTl8obWPcVywmcHbyL8xuPP98cbfMFi1EkltY7N3X5paYZwgSVaG4-2_IWaHos-SA_wyKpkMg',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDeC0xHt972UE783FMof6zw3vTnCWr22OIjfB02AB_HMo7yszTTBGL8KxXmfDoSzA_yoV6wmOaBwHVzC3Ar0rIn8GyThpUN07u0irY0pVYOsQFoJk3h8WpVEKiPFSbJhbfCkXhRMtLH0SxmpJPHR2m7HZxNyC0R1b5VNZVPqXVGFP5V62QdFZCSX40DknpQ4HUjfux_-52iQv8-HD6EnsnYsEuFa0xh2J3I2Q62lKle7H7zSbxHmyoKJh9lqvWrBjFec_GMYaVSsA'
    ],
    'Software',
    'DERIAN MEJIA',
    'Oferta',
    5,
    124,
    true,
    100,
    ARRAY[
        'Real-time malware and ransomware protection.',
        'Secure VPN included for anonymous browsing (500MB/day).',
        'Password Manager to secure your credentials.',
        'Parental Control for safe family browsing.',
        'Compatible with Windows 10/11, macOS, Android, and iOS.'
    ]
),
(
    'netflix-1-month',
    'Netflix 1 Month 4K',
    'Enjoy unlimited streaming of movies and TV shows in stunning 4K quality. One month subscription with instant activation.',
    1.32,
    1.97,
    0.13,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCN2wVU7OSmoFmIqcM8ZQh4XCjpxZlCwb82meVw-gnFdY_tvCDHaYie6LBaTUPgTBsaFBu4Qu4dF93MfwxpAK7sDnImWDR7FxSW1ouSfbaCDTdDOu8eRx5hYFDZG0WuxPFcvWjSrYzsWVcP3__oB8AC3LPw_UvP91bCKE3IVzQnXl9j6vKPeJ-cqe7XtsDZ8S10qMdIcjyMzr0U6o4c6fTyQt87dECTjee5j8tx5OVujCVzw0Pbqt8CyRoEsZPk_phIrPOTARZdiA',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuCN2wVU7OSmoFmIqcM8ZQh4XCjpxZlCwb82meVw-gnFdY_tvCDHaYie6LBaTUPgTBsaFBu4Qu4dF93MfwxpAK7sDnImWDR7FxSW1ouSfbaCDTdDOu8eRx5hYFDZG0WuxPFcvWjSrYzsWVcP3__oB8AC3LPw_UvP91bCKE3IVzQnXl9j6vKPeJ-cqe7XtsDZ8S10qMdIcjyMzr0U6o4c6fTyQt87dECTjee5j8tx5OVujCVzw0Pbqt8CyRoEsZPk_phIrPOTARZdiA'],
    'Streaming',
    'STREAMING PERU',
    'Nuevo',
    5,
    89,
    true,
    50,
    ARRAY[
        '4K Ultra HD streaming quality',
        'Watch on any device',
        'Unlimited movies and TV shows',
        'Cancel anytime',
        'Instant activation'
    ]
),
(
    'spotify-premium',
    'Spotify Premium Upgrade',
    'Upgrade your Spotify account to Premium. Enjoy ad-free music, offline downloads, and unlimited skips.',
    0.79,
    1.32,
    NULL,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXnvOyTxJRybhpt_eLY3Fc9xiBzyBl-1kq8WvtHGS5asEfNrpQHiBaRTgXKBrycMXK_F2w3OazMZ9B8b_u96GBGnny94vZJkPIIWUbUdbtgCp4_fM13-mGdhKwsRZtAklLWgjAanxwDaI11GSsu7TdFNYMsf73OKmOzLR_f83A_DnqqmaPeHJ3w5u_gN4Cz97bJTfdhD7DGcelsx-xJ-g88HAKs2V2Ohp0gGITncFKAjrEgUSyvMM3u-jzog-LU6tF-mD2Xu79IA',
    ARRAY['https://lh3.googleusercontent.com/aida-public/AB6AXuDXnvOyTxJRybhpt_eLY3Fc9xiBzyBl-1kq8WvtHGS5asEfNrpQHiBaRTgXKBrycMXK_F2w3OazMZ9B8b_u96GBGnny94vZJkPIIWUbUdbtgCp4_fM13-mGdhKwsRZtAklLWgjAanxwDaI11GSsu7TdFNYMsf73OKmOzLR_f83A_DnqqmaPeHJ3w5u_gN4Cz97bJTfdhD7DGcelsx-xJ-g88HAKs2V2Ohp0gGITncFKAjrEgUSyvMM3u-jzog-LU6tF-mD2Xu79IA'],
    'Music',
    'MUSIC STORE',
    NULL,
    4,
    56,
    true,
    30,
    ARRAY[
        'Ad-free music listening',
        'Download up to 10,000 songs',
        'Unlimited skips',
        'High quality audio',
        'Listen offline'
    ]
)
ON CONFLICT (slug) DO NOTHING;

-- Verify insertion
SELECT slug, title, price, in_stock FROM products;
