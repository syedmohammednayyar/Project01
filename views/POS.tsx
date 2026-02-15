
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Product, CartItem } from '../types';

// --- MOCK DATA ---
const mockProducts: Product[] = [
    { id: 'P1', name: 'iPhone 15 Pro', brand: 'Apple', model: 'A3102', storage: '256GB', color: 'Natural Titanium', barcode: '1001', sellingPrice: 139999, purchasePrice: 95000, category: 'New Phones', minStockLevel: 5 },
    { id: 'P2', name: 'Samsung S24', brand: 'Samsung', model: 'SM-S928', storage: '512GB', color: 'Titanium Black', barcode: '1002', sellingPrice: 79999, purchasePrice: 65000, category: 'New Phones', minStockLevel: 5 },
    { id: 'P3', name: 'OnePlus 12', brand: 'OnePlus', model: 'CPH2585', storage: '256GB', color: 'Emerald Green', barcode: '1003', sellingPrice: 55999, purchasePrice: 48000, category: 'New Phones', minStockLevel: 5 },
    { id: 'P4', name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', model: '24030PN60G', storage: '512GB', color: 'Black', barcode: '1004', sellingPrice: 69999, purchasePrice: 61000, category: 'New Phones', minStockLevel: 5 },
    { id: 'B1', name: 'iPhone 12 (Used)', brand: 'Apple', model: 'A2403', storage: '128GB', color: 'Blue', barcode: '8001', sellingPrice: -25000, purchasePrice: 0, category: 'Buyback Phones', minStockLevel: 0 },
    { id: 'B2', name: 'Samsung S21 (Used)', brand: 'Samsung', model: 'SM-G991B', storage: '256GB', color: 'Phantom Gray', barcode: '8002', sellingPrice: -18000, purchasePrice: 0, category: 'Buyback Phones', minStockLevel: 0 },
    { id: 'A1', name: 'Tempered Glass', brand: 'Generic', model: 'Universal', storage: '', color: '', barcode: '2001', sellingPrice: 299, purchasePrice: 50, category: 'Accessories', minStockLevel: 20 },
    { id: 'A2', name: 'Premium Case', brand: 'Spigen', model: 'Tough Armor', storage: '', color: '', barcode: '2002', sellingPrice: 899, purchasePrice: 300, category: 'Accessories', minStockLevel: 10 },
    { id: 'A3', name: 'Charger Cable', brand: 'Generic', model: 'USB-C', storage: '', color: '', barcode: '2003', sellingPrice: 500, purchasePrice: 120, category: 'Accessories', minStockLevel: 10 },
    { id: 'Q1', name: 'SIM Ejection', brand: 'Service', model: '', storage: '', color: '', barcode: '9001', sellingPrice: 10, purchasePrice: 0, category: 'Quick Items', minStockLevel: 0 },
];

const mockServices: Product[] = [
    { id: 'S1', name: 'Screen Replacement', sellingPrice: 4500, category: 'Repair Services', brand: 'Service', model: 'N/A', storage: 'N/A', color: 'N/A', barcode: 'SVC-S1', purchasePrice: 0, minStockLevel: 0 },
    { id: 'S2', name: 'Battery Replacement', sellingPrice: 2500, category: 'Repair Services', brand: 'Service', model: 'N/A', storage: 'N/A', color: 'N/A', barcode: 'SVC-S2', purchasePrice: 0, minStockLevel: 0 },
    { id: 'S3', name: 'Water Damage', sellingPrice: 8000, category: 'Repair Services', brand: 'Service', model: 'N/A', storage: 'N/A', color: 'N/A', barcode: 'SVC-S3', purchasePrice: 0, minStockLevel: 0 },
    { id: 'S4', name: 'Software Fix', sellingPrice: 1500, category: 'Repair Services', brand: 'Service', model: 'N/A', storage: 'N/A', color: 'N/A', barcode: 'SVC-S4', purchasePrice: 0, minStockLevel: 0 },
];

const mockStock = [
    { productId: 'P1', stock: 5 }, { productId: 'P2', stock: 8 }, { productId: 'P3', stock: 0 },
    { productId: 'P4', stock: 12 }, { productId: 'A1', stock: 50 }, { productId: 'A2', stock: 30 },
    { productId: 'A3', stock: 45 }, { productId: 'B1', stock: 1 }, { productId: 'B2', stock: 1 },
];

const POS: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customer, setCustomer] = useState({ name: 'Rajesh Kumar', phone: '98XXXXXX01', loyalty: 'Gold' });
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [amountReceived, setAmountReceived] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('New Phones');

    const barcodeRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const getStock = (productId: string) => mockStock.find(s => s.productId === productId)?.stock || 0;

    const filteredProducts = mockProducts.filter(p => 
        p.category === activeCategory &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery))
    );

    const addItemToCart = (item: Product) => {
        setCart(prev => {
            const existingItem = prev.find(i => i.id === item.id);
            if (existingItem && item.category !== 'Buyback Phones') {
                return prev.map(i => i.id === item.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i);
            }
            const cartItem: CartItem = { ...item, cartQuantity: 1, itemDiscount: 0, storeId: 'S2' };
            return [...prev, cartItem];
        });
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(item => item.id === itemId ? { ...item, cartQuantity: Math.max(0, item.cartQuantity + delta) } : item).filter(item => item.cartQuantity > 0));
    };

    const { subtotal, tradeInCredit, finalTotal } = useMemo(() => {
        const sub = cart.reduce((acc, item) => item.category !== 'Buyback Phones' ? acc + item.sellingPrice * item.cartQuantity : acc, 0);
        const credit = cart.reduce((acc, item) => item.category === 'Buyback Phones' ? acc + Math.abs(item.sellingPrice * item.cartQuantity) : acc, 0);
        return { subtotal: sub, tradeInCredit: credit, finalTotal: sub - credit };
    }, [cart]);

    const changeDue = useMemo(() => Math.max(0, amountReceived - finalTotal), [amountReceived, finalTotal]);
    
    const handleBarcodeScan = (e: React.FormEvent) => {
        e.preventDefault();
        const product = mockProducts.find(p => p.barcode === searchQuery);
        if (product) { addItemToCart(product); setSearchQuery(''); } 
        else { alert('Product not found'); }
    };

    const newSale = () => { setCart([]); setAmountReceived(0); setSearchQuery(''); barcodeRef.current?.focus(); };
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const barcode = params.get('barcode');
        if (barcode) {
            const productToAdd = mockProducts.find(p => p.barcode === barcode);
            if (productToAdd) {
                const stock = getStock(productToAdd.id);
                if (stock > 0 || productToAdd.category === 'Buyback Phones') addItemToCart(productToAdd);
                else alert(`'${productToAdd.name}' is out of stock.`);
            } else {
                alert(`Product with barcode '${barcode}' not found.`);
            }
            navigate('/pos', { replace: true });
        } else {
            barcodeRef.current?.focus();
        }
    }, [location]);

    const categories = ['New Phones', 'Buyback Phones', 'Accessories', 'Repair Services', 'Quick Items'];

    const renderCartItem = (item: CartItem) => {
        const isCredit = item.category === 'Buyback Phones';
        const priceDisplay = isCredit ? `-₹${Math.abs(item.sellingPrice).toLocaleString()}` : `₹${item.sellingPrice.toLocaleString()}`;

        return (
            <div key={item.id} className={`p-3 rounded-lg flex items-center gap-4 ${isCredit ? 'bg-success/10' : 'bg-background'}`}>
                <div className="flex-1">
                    <p className={`font-bold text-sm ${isCredit ? 'text-success' : 'text-text-dark'}`}>{item.name}</p>
                    <p className="text-xs text-text-secondary">{priceDisplay} x {item.cartQuantity}</p>
                </div>
                {!isCredit && (
                     <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-surface border border-secondary/20 font-bold text-text-secondary hover:bg-secondary/20">-</button>
                        <span className="w-6 text-center font-bold text-sm text-text-dark">{item.cartQuantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-surface border border-secondary/20 font-bold text-text-secondary hover:bg-secondary/20">+</button>
                    </div>
                )}
                <p className="font-bold text-sm w-24 text-right text-text-dark">{isCredit ? `-₹${(Math.abs(item.sellingPrice) * item.cartQuantity).toLocaleString()}` : `₹${(item.sellingPrice * item.cartQuantity).toLocaleString()}`}</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)] w-full max-w-full mx-auto animate-in fade-in duration-300">
            {/* Left Panel */}
            <div className="lg:w-[35%] bg-surface rounded-2xl shadow-sm border border-secondary/20 flex flex-col p-4">
                <form onSubmit={handleBarcodeScan} className="relative">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">qr_code_scanner</span>
                    <input ref={barcodeRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Scan Barcode, IMEI, or SKU..." className="w-full bg-background border-none rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary" />
                </form>
                <div className="flex gap-2 my-4 overflow-x-auto pb-2 -mx-4 px-4">
                    {categories.map(cat => ( <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-dark'}`}>{cat}</button>))}
                </div>
                <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pr-1 -mr-1">
                    {activeCategory === 'Repair Services' ? mockServices.map(s => (
                        <button key={s.id} onClick={() => addItemToCart(s)} className="bg-background p-3 rounded-lg text-left focus:outline-none focus:ring-2 ring-primary transition-all flex flex-col">
                            <h4 className="font-bold text-text-dark text-sm flex-1">{s.name}</h4>
                            <p className="font-bold text-primary text-xs mt-1">₹{s.sellingPrice.toLocaleString()}</p>
                        </button>
                    )) : filteredProducts.map(p => {
                        const stock = getStock(p.id);
                        return (
                            <button key={p.id} onClick={() => addItemToCart(p)} disabled={stock <= 0 && p.category !== 'Buyback Phones'} className="bg-background p-3 rounded-lg text-left focus:outline-none focus:ring-2 ring-primary transition-all disabled:opacity-40 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-text-dark text-sm flex-1 pr-2">{p.name}</h4>
                                    {p.category !== 'Buyback Phones' && <span className={`text-[9px] font-bold px-1.5 rounded ${stock > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>{stock} in stock</span>}
                                </div>
                                <p className={`font-bold text-xs mt-auto pt-2 ${p.sellingPrice < 0 ? 'text-success' : 'text-primary'}`}>{p.sellingPrice < 0 ? `Credit: ₹${Math.abs(p.sellingPrice).toLocaleString()}` : `₹${p.sellingPrice.toLocaleString()}`}</p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Middle Panel */}
            <div className="lg:w-[35%] bg-surface rounded-2xl shadow-sm border border-secondary/20 flex flex-col p-4">
                 <div className="p-3 bg-background rounded-lg flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-icons text-xl text-text-secondary">person</span>
                        <div>
                            <p className="font-bold text-text-dark">{customer.name}</p>
                            <p className="text-[10px] font-bold text-warning uppercase">{customer.loyalty} Member</p>
                        </div>
                    </div>
                    <button className="text-xs font-bold text-primary">Change</button>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 space-y-2">{cart.map(renderCartItem)} {cart.length === 0 && <p className="text-center text-text-secondary italic pt-10">Scan an item to start</p>}</div>
                <div className="pt-4 border-t border-secondary/20 mt-auto space-y-2 text-sm">
                    <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                    {tradeInCredit > 0 && <div className="flex justify-between text-success"><span>Trade-in Credit</span><span>-₹{tradeInCredit.toLocaleString()}</span></div>}
                    <div className="flex justify-between text-text-secondary"><span>Discount</span><span>-₹0</span></div>
                    <div className="flex justify-between font-bold text-xl text-text-dark pt-2 border-t border-dashed border-secondary/20"><span>Total</span><span>₹{finalTotal.toLocaleString()}</span></div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="lg:w-[30%] bg-surface rounded-2xl shadow-sm border border-secondary/20 flex flex-col p-4">
                <div>
                    <p className="text-[10px] uppercase font-bold text-text-secondary mb-2">Payment Methods</p>
                    <div className="grid grid-cols-3 gap-2">{['Cash', 'Card', 'UPI', 'Online', 'Partial'].map(method => (<button key={method} onClick={() => setPaymentMethod(method)} className={`py-2.5 rounded-lg text-xs font-bold transition-colors ${paymentMethod === method ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-dark'}`}>{method}</button>))}</div>
                </div>
                <div className="my-4">
                    <label className="text-[10px] uppercase font-bold text-text-secondary mb-1 block">Amount Received</label>
                    <input type="number" value={amountReceived || ''} onChange={(e) => setAmountReceived(Number(e.target.value))} className="w-full bg-background border-none rounded-lg px-4 py-3 text-lg font-bold text-right focus:ring-2 focus:ring-primary" />
                </div>
                <div className="text-center bg-success/10 text-success p-3 rounded-lg"><p className="text-xs font-bold">Change Due</p><p className="text-2xl font-bold">₹{changeDue.toLocaleString()}</p></div>
                <div className="flex-1 flex flex-col justify-end mt-4 space-y-2">
                    <div className="p-2 border-t border-secondary/20 space-y-2 pt-4">
                       <label className="flex items-center gap-3 text-sm font-medium text-text-dark"><input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" /> Apply Gift/Voucher</label>
                       <label className="flex items-center gap-3 text-sm font-medium text-text-dark"><input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" /> Email Receipt</label>
                    </div>
                    <button className="w-full text-center py-4 bg-primary text-white rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-primary/90 active:scale-95 transition-transform">✓ Process Payment</button>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="w-full text-center py-2.5 bg-background text-text-secondary rounded-lg font-bold text-xs hover:text-text-dark">🖨️ PRINT RECEIPT</button>
                        <button onClick={newSale} className="w-full text-center py-2.5 bg-background text-text-secondary rounded-lg font-bold text-xs hover:text-text-dark">↻ NEW SALE</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default POS;