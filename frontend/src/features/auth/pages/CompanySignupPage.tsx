import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { requestJson } from "../../../lib/api";
import AuthLayout from "../components/AuthLayout";
import AccountFields from "../components/AccountFields";
import FormField from "../components/FormField";
import { SectionHeading, SignupTop } from "../components/SignupParts";

interface CompanySignupForm {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  businessNumber: string;
  address: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const initialForm: CompanySignupForm = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  businessNumber: "",
  address: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export default function CompanySignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof CompanySignupForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!form.name.trim() || !form.companyName.trim() || !form.businessNumber.trim() || !form.address.trim()) {
      setError("필수 정보를 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await requestJson<{ userId: number; message?: string }>("/api/companies/signup", {
        method: "POST",
        body: JSON.stringify({
          loginId: form.username.trim(),
          password: form.password,
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          companyName: form.companyName.trim(),
          businessNumber: form.businessNumber.trim(),
          address: form.address.trim(),
          logoImage: null,
        }),
      });
      window.alert("기업회원 가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "기업회원 가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout wide title="좋은 해운 인재를 만나보세요">
      <SignupTop
        title="기업회원 가입"
        subtitle="기업 정보를 등록하고 해운·선박 분야의 인재를 연결하세요."
        onBack={() => navigate("/signup")}
      />
      <form className="auth-form signup-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <SectionHeading number="01" title="기업 기본정보" description="기업과 담당자 정보를 입력해주세요." />
          <div className="form-grid">
            <FormField label="기업명" name="companyName" value={form.companyName} onChange={(value) => update("companyName", value)} placeholder="기업명을 입력해주세요" required />
            <FormField label="사업자등록번호" name="businessNumber" value={form.businessNumber} onChange={(value) => update("businessNumber", value)} placeholder="사업자등록번호" required />
            <FormField label="담당자 이름" name="name" value={form.name} onChange={(value) => update("name", value)} placeholder="담당자 이름" required />
            <FormField label="기업 주소" name="address" value={form.address} onChange={(value) => update("address", value)} placeholder="기업 주소" required />
            <FormField label="이메일" name="email" type="email" value={form.email} onChange={(value) => update("email", value)} placeholder="업무용 이메일" />
            <FormField label="전화번호" name="phone" type="tel" value={form.phone} onChange={(value) => update("phone", value)} placeholder="연락 가능한 전화번호" />
          </div>
        </section>

        <AccountFields
          username={form.username}
          password={form.password}
          confirmPassword={form.confirmPassword}
          onChange={(field, value) => update(field, value)}
        />

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="button" onClick={() => navigate("/signup")} disabled={submitting}>이전</button>
          <button type="submit" disabled={submitting}>{submitting ? "가입 처리 중..." : "기업회원으로 가입하기"}</button>
        </div>
      </form>
    </AuthLayout>
  );
}
