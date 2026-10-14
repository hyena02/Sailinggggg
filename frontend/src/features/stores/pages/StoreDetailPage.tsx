import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Footer from "../../../components/common/footer";
import Header from "../../../components/common/header";
import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import "../../../styles/home.css";
import { getStore } from "../storeApi";
import type { StoreItem } from "../storeTypes";
import "../Stores.css";

export default function StoreDetailPage() {
  const { storeId = "" } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<StoreItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getStore(storeId)
      .then((item) => {
        if (active) setStore(item);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getErrorMessage(requestError, "업체정보를 불러오지 못했습니다."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [storeId]);

  const homepageUrl = store?.homepage
    ? store.homepage.startsWith("http") ? store.homepage : `https://${store.homepage}`
    : null;
  const servicePorts = (store?.servicePorts ?? "")
    .split(/[，,\n]/)
    .map((port) => port.trim())
    .filter(Boolean);

  return (
    <div className="subpage stores-page">
      <Header />
      <main className="store-detail container">
        <button type="button" className="page-back" onClick={() => navigate("/stores")}>
          <Icon name="chevron" size={17} /> 업체 목록
        </button>

        {loading ? (
          <div className="community-empty" role="status">업체정보를 불러오는 중입니다.</div>
        ) : error || !store ? (
          <div className="community-empty" role="alert">
            <strong>업체정보를 표시할 수 없습니다.</strong>
            <p>{error || "요청한 업체를 찾을 수 없습니다."}</p>
            <small>현재 백엔드에 업체 상세 조회 API가 구현되어 있는지 확인해주세요.</small>
          </div>
        ) : (
          <div className="store-detail__layout">
            <article className="store-profile">
              <header>
                {store.featureImage && (
                  <img className="store-card__image" src={store.featureImage} alt={`${store.storeName} 대표 이미지`} />
                )}
                <div>
                  <Icon name="building" size={34} />
                  <span className={`store-badge ${store.verificationStatus === "APPROVED" ? "store-badge--new" : ""}`}>
                    {store.verificationStatus === "APPROVED" ? "인증 완료" : "등록 업체"}
                  </span>
                </div>
                <h1>{store.storeName}</h1>
                <p>{store.introduction || store.serviceDetails || "등록된 업체 소개가 없습니다."}</p>
                <small>{store.serviceCountry || store.region || "서비스 지역 미등록"}</small>
              </header>

              <section>
                <h2>제공 서비스</h2>
                <p>{store.serviceDetails || "서비스 상세정보가 등록되지 않았습니다."}</p>
                {servicePorts.length > 0 && (
                  <div className="port-list">
                    {servicePorts.map((port) => (
                      <span key={port}><Icon name="map" size={13} />{port}</span>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h2>업체 정보</h2>
                <dl>
                  <div><dt>대표자</dt><dd>{store.representative || "미등록"}</dd></div>
                  <div><dt>주소</dt><dd>{store.address || "미등록"}</dd></div>
                  <div><dt>서비스 국가</dt><dd>{store.serviceCountry || "미등록"}</dd></div>
                  <div><dt>지역</dt><dd>{store.region || "미등록"}</dd></div>
                  <div>
                    <dt>홈페이지</dt>
                    <dd>{homepageUrl ? <a href={homepageUrl} target="_blank" rel="noreferrer">홈페이지 방문</a> : "미등록"}</dd>
                  </div>
                  <div><dt>비고</dt><dd>{store.remarks || "-"}</dd></div>
                </dl>
              </section>
            </article>

            <aside className="store-contact-card">
              <span>CONTACT</span>
              <h2>업체 문의</h2>
              <p>등록된 연락처를 통해 업체에 문의할 수 있습니다.</p>
              {store.email && <p><strong>이메일</strong><br />{store.email}</p>}
              {store.phone && <p><strong>전화번호</strong><br />{store.phone}</p>}
              <button type="button" className="button button--primary" onClick={() => navigate("/login")}>
                로그인 후 문의하기 <Icon name="arrow" size={16} />
              </button>
              <small>채팅 기능은 실제 메시지 API 연결 후 제공됩니다.</small>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
