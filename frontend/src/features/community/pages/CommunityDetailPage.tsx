import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Icon from "../../../components/common/icon";
import { getErrorMessage } from "../../../lib/api";
import CommunityLayout from "../components/CommunityLayout";
import { getCommunityPost } from "../communityApi";
import type { CommunityPost } from "../communityTypes";

export default function CommunityDetailPage() {
  const { postId = "" } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCommunityPost(postId)
      .then((item) => {
        if (active) setPost(item);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getErrorMessage(requestError, "게시글을 불러오지 못했습니다."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [postId]);

  return (
    <CommunityLayout>
      <main className="community-page container">
        <button className="page-back" type="button" onClick={() => navigate("/community")}>
          <Icon name="chevron" size={17} /> 커뮤니티
        </button>

        {loading ? (
          <div className="community-empty" role="status">게시글을 불러오는 중입니다.</div>
        ) : error || !post ? (
          <div className="community-empty" role="alert">
            <strong>게시글을 표시할 수 없습니다.</strong>
            <p>{error || "요청한 게시글을 찾을 수 없습니다."}</p>
            <small>게시글 상세 조회 API가 백엔드에 구현되어 있는지 확인해주세요.</small>
          </div>
        ) : (
          <article className="post-view__card">
            <header className="post-view__meta-top">
              <span>{post.category}</span>
              <span>조회 {post.viewCount ?? 0}</span>
            </header>
            <h1>{post.title}</h1>
            <div className="post-view__author">
              <strong>{post.nickname || "회원"}</strong>
              <span>{post.createdAt ? new Date(post.createdAt).toLocaleString("ko-KR") : "날짜 미등록"}</span>
            </div>
            <div className="post-view__body">
              {(post.content || "").split(/\r?\n/).map((line, index) => (
                <p key={`${index}-${line}`}>{line || " "}</p>
              ))}
            </div>
            <footer>
              <div className="post-reactions">
                <span><Icon name="thumb-up" size={16} /> 공감 {post.likeCount ?? 0}</span>
                <span><Icon name="thumb-down" size={16} /> 비공감 {post.dislikeCount ?? 0}</span>
              </div>
            </footer>
          </article>
        )}

        {post && !loading && !error && (
          <section className="comment-card">
            <h2>댓글</h2>
            <div className="community-empty">
              <p>댓글 등록 및 조회 API는 아직 연결되지 않았습니다.</p>
            </div>
          </section>
        )}
      </main>
    </CommunityLayout>
  );
}
