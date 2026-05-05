/**
 * Mock Theme and Content for local testing.
 * Tone: "Sunset Glow" - Phong cách Cam/Hồng rực rỡ, năng động.
 */
export const themeMock = {
  theme: {
    colors: {
      primary: '#f97316', // Orange 500
      background: '#fff1f2', // Rose 50 (Very light pink)
      text: '#1e293b', // Slate 800
    },
    typography: {
      fontFamily: 'Outfit, Inter, sans-serif',
    },
    layout: {
      borderRadius: 20, // Bo góc tròn trịa, trẻ trung hơn
    },
    components: {
      header: {
        background: '#ffffff',
        text: '#f97316',
      },
      footer: {
        background: '#1e293b',
        text: '#fda4af', // Rose 300
      },
      productCard: {
        background: '#ffffff',
        text: '#1e293b',
        price: '#db2777', // Pink 600
        badge: '#f472b6', // Pink 400
      }
    }
  },
  content: {
    home: {
      title: 'SUNSET GLOW VIBES',
      subtitle: 'Đón nhận năng lượng tích cực với bộ sưu tập mang sắc màu hoàng hôn rực rỡ.',
      heroImageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&q=80',
      heroOverlayOpacity: 0.3,
      featuredTitle: '🔥 Hottest Picks',
      featuredSubtitle: 'Những siêu phẩm đang làm mưa làm gió trong mùa hè này.',
    },
    about: {
      story: 'Fluxify mang đến sự kết hợp đầy táo bạo giữa sắc Cam năng động và màu Hồng ngọt ngào. \n\nSunset Glow không chỉ là một chủ đề, đó là phong cách sống hiện đại, tràn đầy nhiệt huyết và sự tự tin.',
    }
  }
};
