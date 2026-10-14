import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import "../../../styles/home.css";
import { getStores } from "../storeApi";
import type { StoreItem } from "../storeTypes";
import "../Stores.css";

function getStoreId(store: StoreItem): number | undefined {
  return store.storeInfoId ?? store.storeId;
}

export default function StoreListPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("전체 국가");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getStores()
      .then((rows) => {
        if (active) setStores(Array.isArray(rows) ? rows : []);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError, "업체정보를 불러오지 못했습니다."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const countries = useMemo(
    () => ["전체 국가", ...new Set(stores.map((store) => store.serviceCountry || "").filter(Boolean))],
    [stores],
  );

  const filteredStores = stores.filter((store) => {
    const searchable = [
      store.storeName,
      store.serviceCountry,
      store.region,
      store.servicePorts,
      store.serviceDetails,
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();

    const matchesQuery = searchable.includes(query.trim().toLocaleLowerCase());
    const matchesCountry = country === "전체 국가" || store.serviceCountry === country;
    return matchesQuery && matchesCountry;
  });

  function openStore(store: StoreItem) {
    const storeId = getStoreId(store);
    if (storeId !== undefined) navigate(`/stores/${storeId}`);
  }

  return (
    <div className="subpage stores-page">
      <Header />
      <main>
        <section className="stores-hero">
          <div className="container">
            <span>SAILING STORES</span>
            <h1>바다를 연결하는<br />서비스 파트너</h1>
            <p>해운·선박 및 항만 관련 업체 정보를 확인하세요.</p>
          </div>
        </section>

        <section className="stores-board container">
          <div className="stores-heading">
            <div>
              <span>MARITIME SERVICE DIRECTORY</span>
              <h2>업체정보</h2>
              <p>등록된 업체의 서비스와 연락 정보를 확인할 수 있습니다.</p>
            </div>
            <strong>총 {filteredStores.length}곳</strong>
          </div>

          <div className="stores-filter">
            <label>
              <Icon name="search" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="업체명, 서비스, 국가, 항구 검색"
              />
            </label>
            <div className="store-country-filter">
              {countries.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={country === item ? "is-active" : ""}
                  onClick={() => setCountry(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="community-empty" role="status">
              업체정보를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="community-empty" role="alert">
              <Icon name="bell" size={28} />
              <strong>업체정보 API에 연결할 수 없습니다.</strong>
              <p>{error}</p>
              <small>현재 백엔드에는 업체 회원가입 API만 있으며, 업체 목록 조회 API는 확인되지 않았습니다.</small>
            </div>
          ) : filteredStores.length > 0 ? (
            <div className="store-grid">
              {filteredStores.map((store) => {
                const storeId = getStoreId(store);
                return (
                  <article
                    className="store-card"
                    role="link"
                    tabIndex={0}
                    key={storeId ?? store.storeName}
                    onClick={() => openStore(store)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openStore(store);
                      }
                    }}
                  >
                    {store.featureImage && (
                      <img
                        className="store-card__image"
                        src={store.featureImage}
                        alt={`${store.storeName} 대표 이미지`}
                      />
                    )}
                    <div className="store-card__top">
                      <Icon name="building" size={22} />
                      <span className={`store-badge ${store.verificationStatus === "APPROVED" ? "store-badge--new" : ""}`}>
                        {store.verificationStatus === "APPROVED"
                          ? "인증 완료"
                          : store.verificationStatus === "PENDING"
                            ? "인증 심사 중"
                            : "업체 정보"}
                      </span>
                    </div>
                    <span className="store-card__category">
                      {store.serviceCountry || store.region || "서비스 지역 미등록"}
                    </span>
                    <h3>{store.storeName}</h3>
                    <p>{store.introduction || store.serviceDetails || "등록된 소개가 없습니다."}</p>
                    {store.servicePorts && (
                      <div className="store-card__ports">
                        <Icon name="map" size={14} />
                        {store.servicePorts}
                      </div>
                    )}
                    <div className="store-card__footer">
                      <span>{store.address || "주소 미등록"}</span>
                      <strong>상세정보 <Icon name="chevron" size={14} /></strong>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="community-empty">
              <Icon name="search" size={28} />
              <strong>{stores.length > 0 ? "검색 결과가 없습니다." : "등록된 업체정보가 없습니다."}</strong>
              <p>
                {stores.length > 0
                  ? "검색어나 국가 조건을 바꿔보세요."
                  : "업체정보가 등록되면 이곳에 표시됩니다."}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
