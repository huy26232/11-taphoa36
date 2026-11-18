import { useState } from 'react';
import { PageId } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FreshProducePage } from './pages/FreshProducePage';
import { MeatSeafoodPage } from './pages/MeatSeafoodPage';
import { EggsTofuPage } from './pages/EggsTofuPage';
import { SpicesSaucesPage } from './pages/SpicesSaucesPage';
import { NoodlesDryPage } from './pages/NoodlesDryPage';
import { DairySnacksPage } from './pages/DairySnacksPage';
import { BeveragesPage } from './pages/BeveragesPage';
import { LaundryCleaningPage } from './pages/LaundryCleaningPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(3);
  const [cartTotal, setCartTotal] = useState(145000);

  const handleNavigate = (page: PageId, hash?: string) => {
    setCurrentPage(page);
    window.setTimeout(() => {
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const handleAddToCart = (price: number, qty = 1) => {
    if (qty <= 0 || price <= 0) return;
    setCartCount((prev) => prev + qty);
    setCartTotal((prev) => prev + price * qty);
  };

  const renderPage = () => {
    const commonProps = {
      onNavigate: handleNavigate,
      onAddToCart: handleAddToCart,
    };

    switch (currentPage) {
      case 'home':
        return <HomePage {...commonProps} />;
      case 'fresh-produce':
        return <FreshProducePage {...commonProps} />;
      case 'meat-seafood':
        return <MeatSeafoodPage {...commonProps} />;
      case 'eggs-tofu':
        return <EggsTofuPage {...commonProps} />;
      case 'spices-sauces':
        return <SpicesSaucesPage {...commonProps} />;
      case 'noodles-dry':
        return <NoodlesDryPage {...commonProps} />;
      case 'dairy-snacks':
        return <DairySnacksPage {...commonProps} />;
      case 'beverages':
        return <BeveragesPage {...commonProps} />;
      case 'household-laundry':
        return <LaundryCleaningPage {...commonProps} />;
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        cartTotal={cartTotal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="w-full pt-36 bg-surface min-h-[calc(100vh-144px)] flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
