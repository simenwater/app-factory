import { redirect } from 'next/navigation';

/**
 * @description 根路由重定向到仪表盘
 */
export default function Home() {
  redirect('/dashboard');
}
