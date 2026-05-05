/**
 * Mock Theme and Content for local testing.
 * Tone: "Cyber Crimson" - Một phong cách đỏ hiện đại, mạnh mẽ.
 */
export const themeMock = {
  theme: {
    colors: {
      primary: '#e11d48', // Rose 600 (Đỏ hiện đại, hơi ánh hồng ngoại)
      background: '#0f172a', // Dark Navy/Slate
      text: '#ffffff', // Trắng tinh khiết
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
    layout: {
      borderRadius: 12, // Bo góc vừa phải, hiện đại
    },
    components: {
      header: {
        background: '#020617', // Đen sâu
        text: '#ffffff',
      },
      footer: {
        background: '#020617',
        text: '#94a3b8',
      },
      productCard: {
        background: '#1e293b',
        text: '#f1f5f9',
        price: '#fb7185', // Rose 400 cho giá tiền nổi bật
        badge: '#e11d48', // Badge màu đỏ trùng tone primary
      }
    }
  },
  content: {
    home: {
      title: 'CYBER CRIMSON COLLECTION',
      subtitle: 'Trải nghiệm phong cách mua sắm thế hệ mới với tone đỏ Cyber đầy quyền lực.',
      heroImageUrl: 'https://images.unsplash.com/photo-1549484770-466ca926529e?auto=format&fit=crop&w=1600&q=80',
      heroOverlayOpacity: 0.6,
      featuredTitle: '🔥 Hot Deals of the Week',
      featuredSubtitle: 'Những sản phẩm được săn đón nhất trong bộ sưu tập Crimson.',
    },
    about: {
      story: 'Chúng tôi không chỉ bán sản phẩm, chúng tôi bán một phong cách sống đầy nhiệt huyết. \n\nCyber Crimson đại diện cho sự bứt phá và đam mê trong từng chi tiết sản phẩm. Hãy khám phá câu chuyện của chúng tôi.',
    }
  }
};
