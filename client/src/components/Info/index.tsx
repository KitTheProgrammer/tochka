import React from 'react'
import './styles/styles.css'

export const Info = (): React.ReactElement => {
    return <div className={'info-container'}>
        <h1 className={'info-container__center'}>Регламент творческого объединения </h1>
        <h5 className={'info-container__center info-container__italic'}>Зачем нужны правила, если все мы друзья и умные, соображающие люди?<br/>
        Чтобы доказать, что мы такие на самом деле, и создаем комфортные условия друг для друга.</h5>

        <h2>1. Оповещение о любой ситуации в телеграм-чате (= панацея от любых сюрпризов).</h2>
        <p>
            Всё, что касается вопросов интерьера и экстерьера точки, использования, неисправностей аппарата и любых смежных вопросов,<br/>
            обсуждается в общем чате, чтобы все участники творческого объединения были в курсе происходящего.<br/><br/>
            Даже если это разговор 1 на 1, и напрямую не касается остальных, необходимо, что все были в курсе ситуации.<br/>
            Если такого рода вопрос обсуждается по телефону или вживую, он также поднимается в чате.<br/>
            <h5>Примеры таких ситуаций:</h5>
            "Хочу принести стул на базу, чтобы сидеть на нем жопой" – все знают чей стул и чем на нем сидеть;<br/>
            "Чел, кнопка западает, я хз почему" – все знают, что кнопка западает и все хз почему;<br/>
            "Забыл наушники, передайте им, что я их люблю" – кто-то точно сделает это;<br/>
            и т.п.
        </p>
        <h3>1.1 Без третьих лиц.</h3>
        <p>
            Люди, которые не являются участниками творческого объединения, не приводятся на точку.<br/><br/>
            Если уж есть такая необходимость – причина и обстоятельства обсуждаются в общем чате:<br/>
            если никто не высказался "против", добро пожаловать гостям,<br/>
            если по системе голосования (см. в конце страницы "райдер") просьба не одобрена – варварам вход воспрещен (сори).<br/><br/>
            Если однажды вам было позволено привести гостя, это не значит, что был оформлен карт-бланш на его нахождение на точке –<br/>
            каждый новый приход должен быть снова одобрен общиной, даже если гость тот же.<br/>
        </p>
        <h3>1.2 Не передавайте ключи от гаража третьим лицам.</h3>
        <p>
            При необходимости причина и обстоятельства обсуждаются в общем чате, решение принимается по аналогии с пунктом 1.1
        </p>

        <h2>2. Алгоритм действий при покидании помещения.</h2>
        <p>
            На двери гаража с внутренней стороны вывешен алгоритм действий, который необходимо соблюдать при покидании помещения.<br/>
            Он представлен в пунктах 2.1 – 2.5.
        </p>
        <h3>2.1 Убедитесь, что оставляете помещение в том же состоянии, в котором его встретили (а то и лучше!);</h3>
        <h3>2.2 Если мусорник заполнен или содержит в себе органику – выбросите мусорный пакет в контейнер на выходе из кооператива;</h3>
        <h3>2.3 Прежде чем обесточить гараж, убедитесь, что весь аппарат в выключенном состоянии;</h3>
        <h3>2.4 Выключите электричество, задействовав переключатель в нижней части стабилизатора напряжения;</h3>
        <h3>2.5 Заприте дверь гаража на два (!) замка.</h3>

        <h2>3. Отмена бронирования.</h2>
        <p>
            Не втыкайте заранее сообщать об отмене своих забронированных репетиций, будь они одноразовые или постоянные,<br/>
            т.к. с определенной долей вероятности на это время претендуете не только вы.<br/><br/>
            Чем эффективнее распределяется время на точке, тем плодотворнее мы становимся и целесообразнее тратим деньги.<br/>
        </p>

        <h2>4. Сменная обувь.</h2>
        <p>
            С целью соблюдения чистоты рабочего пространства вход на точку сопровождается сменой обуви.<br/>
            Чтобы исключить "ой, я забыл", сменная обувь оставляется на точке в отведенном месте.
        </p>
        <h3>
            Каждое несоответствие поведения с этими правилами обременяет нарушителя одним из следующих способов наказания<br/>
            (составленных в список начиная с наименьшего уровня жестокости) в зависимости от степени причинения вреда:<br/>
            <p>
                1) моральное унижение,<br/>
                2) моральное уничтожение,<br/>
                3) мойка пола;<br/>
            </p>
            и определяется пострадавшей стороной либо общиной.
        </h3>
    </div>
}

export default Info
