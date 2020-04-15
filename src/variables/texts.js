export const orderText ={
    header: '注文内容確認',
    shippingFee:'配送代',
    grandTotal:'合計',
    orderInformation:'注文者情報入力',
    labelName:'名前*',
    labelPhone:'電話番号*',
    labelAddress:'住所*',
    labelMethod:'受取方法',
    selectDelivery:'デリバリー',
    selectPickup:'お持ち帰り',
    labelTime:'受取希望時間（時間指定がなければ最短でお届けします)',
    labelEmail:'メールアドレス',
    labelNote:'追記事項（特定の食材抜き、箸・スプーン不要などの特別な注文はこちらに記入してください）',
    note:'入力していたいただいたメールアドレス宛に注文状況、配達状況などをメールでリアルタイムに共有します。',
    clear:'削除',
    error:{
        name:'お客様の名前を入力してください',
        phone:'電話番号を入力してください',
        address:'住所を入力してください',
        timeFormat:'正しい時間を記入してください',
        timeOpen:'営業時間内の時間を記入してください'
    },
    submit:'注文',
    dialogSuccess:{
        header:'注文は完了しました',
        text1:'あなたの注文情報はレストランに送信されました',
        text2:'レストランの確認をお待ちください'
    },
    dialogFailed:{
       header:'注文に失敗しました',
       text:'もう一度試してください!'
    },
    success:'注文は完了しました'
}

export const restaurantText = {
    header:'レストランの詳細',
    openTime:'営業時間',
    menu:'メニュー一覧',
    dataEmpty:'まだこの店舗にメニューが登録されていません',
    submit:'確定',
    dialogOpenTime:{
        header:'この店舗は現在営業しておりません',
        text:'メニューはあとで選ぶことができます'
    },
    dialogFailedMenu:{
        text:'申し訳ありません。このメニューは売り切れました:'
    },
    dialogFailedSubmit:{
        header:'注文に失敗しました',
        text:'もう一度試してください!'
    }
}

export const categoryText = {
    search:'名前で店舗を探す...',
    dataEmpty:'店舗が見つかりません'
}