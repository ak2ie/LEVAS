export default function ({ store, redirect, route }) {
  if (!store.getters['isLoggedIn']) {
    // ログアウト状態
    if (route.path !== '/login') {
      // ページ閲覧不可（ログイン画面を除く）
      return redirect('/login')
    }
  } else {
    // ログイン状態
    if (route.path === '/login') {
      // 必要ないのでログインページは開かない
      return redirect('/dashboard/Dashboard')
    }
  }
}
