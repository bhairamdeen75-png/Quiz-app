import TestPlayer from '@/components/test/TestPlayer';

export default function TestPage({ params }: { params: { testId: string } }) {
  return <TestPlayer testId={params.testId} />;
}
