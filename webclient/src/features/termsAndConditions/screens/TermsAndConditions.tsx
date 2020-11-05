import {
  Box,
  Container,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Theme,
  Paper,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { styles } from "../../../common/theme";
import { ToolbarPadding } from "../../../common/components";
import { MobileNavBar, NavBar, Footer } from "../components";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, ...props }) => {
  return (
    <Box className={classes.root}>
      <NavBar />
      <MobileNavBar />
      <ToolbarPadding />
      <Container className={classes.policyContent} maxWidth="md">
        <Box>
          <h1>Política de Privacidad de IBEX</h1>
          <section>
            <p>
              Tu privacidad es importante para ****, Sociedad Anónima (en adelante
              indistintamente “IBEX”). Por eso, desarrollamos una Política de Privacidad que
              abarca cómo recolectamos, usamos, y almacenamos tu información personal. Para
              los efectos de la presente política de privacidad, se entenderá como Datos
              Personales la información concerniente a personas naturales identificadas o
              identificables. Por otro lado, para los efectos de la presente política de
              privacidad, se entenderá como Usuario la persona natural o jurídica que acepta
              todas las estipulaciones de la política de privacidad. IBEX no comercializa
              Datos Personales o Datos Sensibles del Usuario.
            </p>
          </section>
          <section>
            <p>
              <strong>
                Con la aceptación de los términos y condiciones de servicio, así como a la
                política de privacidad, otorgas tu consentimiento expreso a IBEX para el
                uso, análisis, tratamiento, procesamiento, manejo, análisis, y cualquier
                otra acción referente al manejo de datos contenida en la siguiente política
                de privacidad.
              </strong>
            </p>
          </section>
          <section>
            <h2>PROTECCIÓN DE LA INFORMACIÓN PERSONAL</h2>
            <p>
              IBEX toma muy en serio la seguridad de tu información personal. Los servicios
              de IBEX usan sistemas informáticos con acceso restringido alojados. Por esa
              razón, lee detenidamente la siguiente política de privacidad
            </p>
            <section>
              <h3>RECOPILACIÓN Y USO DE LA INFORMACIÓN PERSONAL</h3>
              <ol type="I">
                <li>
                  <p>
                    IBEX podrá pedirte que proporciones información personal en cualquier
                    momento en que estés en contacto con la plataforma IBEX. No estás
                    obligado a proporcionar la información personal que te solicitamos,
                    pero, si eliges no hacerlo, en muchos casos no podremos proporcionarte
                    los productos o servicios o responder a las consultas que puedas tener.
                    En caso de aceptar los términos y condiciones de uso, otorgas tu
                    <strong> consentimiento expreso</strong> para que IBEX pueda realizar
                    las acciones descritas en la siguiente Política de Privacidad.
                  </p>
                </li>
                <li>
                  <p>
                    IBEX podrá recolectar los Datos Personales por medio de su plataforma
                    web ya sea directamente o a través de terceros. Por el acceso de
                    terceros se entenderán acceso a: Google Analytics, Google Ads, Cookies,
                    Datos de uso, identificadores únicos de dispositivo, identificadores
                    únicos de dispositivo para publicidad (ID de publicidad de Google o
                    IDFA, por ejemplo), Permiso para el calendario, Permiso para
                    aplicaciones, Permiso para los contactos, Permiso para la cámara,
                    Permiso para acceder a la ubicación exacta (en modo continuo), Permiso
                    para acceder a la ubicación exacta (en modo no continuo), Permiso de
                    ubicación aproximada (en modo continuo), Permiso de ubicación aproximada
                    (en modo no continuo), Permiso para el micrófono, Permiso para el
                    teléfono, Permiso para los sensores, Permiso sobre SMS, Permiso de
                    almacenamiento, Permiso para Recordatorios, Permiso para los sensores de
                    movimiento, Permiso para compartir a través de Bluetooth, Permiso sobre
                    cuentas en redes sociales, dirección de correo electrónico, nombre,
                    apellido(s), número de teléfono, Usuario (username), contraseña
                    (password), foto de perfil, cuentas en redes sociales; distintas clases
                    de Datos del dispositivo móvil y sus aplicaciones y en general cualquier
                    otra interacción de con la plataforma web de IBEX con el Usuario y/o su
                    dispositivo móvil.
                  </p>
                </li>
              </ol>
            </section>
            <p>
              Los sitios web, los productos, las aplicaciones y los servicios de IBEX pueden
              contener enlaces a sitios web, productos y servicios de terceros. Nuestros
              productos y servicios también pueden usar u ofrecer productos o servicios de
              terceros. La información recolectada por terceros, que puede incluir datos de
              ubicación o detalles de contacto, se rige por sus prácticas de privacidad. Te
              recomendamos que te informes acerca de las prácticas de privacidad de esos
              terceros.
            </p>
            <p>
              El Usuario asume la responsabilidad respecto de los Datos Personales de
              terceros que se obtengan, publiquen o compartan a través de esta plataforma
              web y declara por la presente que tiene el consentimiento de dichos terceros
              para proporcionar dichos Datos a IBEX. En caso no tenga la autorización de
              terceros, el Usuario mantendrá indemne a IBEX por la omisión en gestionar
              cualquier autorización y/o consentimiento con terceros.
            </p>
          </section>
          <section>
            <h2>CASOS DE PROCEDENCIA DE USOS DE DATOS</h2>
            <p>
              IBEX podrá recolectar, analizar, utilizar y procesar tus Datos Personales para
              cumplir con los fines que se describen en esta Política de Privacidad. Con tu
              consentimiento utilizaremos tus Datos Personales para cumplir con: (i) los
              términos y condiciones del que formas parte; (ii) proteger tus intereses
              vitales; (iii) cuando consideremos que es necesario por motivos relacionados
              con los intereses legítimos de IBEX; o, (iv) proporcionarle información a una
              autoridad pública, en caso sea necesario.
            </p>
            <p>
              Por lo anterior, IBEX podrá tratar los Datos Personales del Usuario, si se
              cumple una de las siguientes condiciones:
            </p>
            <ul>
              <li>
                <p>Cuando los Usuarios hayan dado su consentimiento</p>{" "}
              </li>
              <li>
                <p>
                  Cuando la obtención de Datos sea necesaria para otorgar servicios o
                  productos;
                </p>
              </li>
              <li>
                <p>
                  Cuando el tratamiento sea necesario para el cumplimiento de una obligación
                  legal de obligado cumplimiento por parte del Usuario.
                </p>
              </li>
            </ul>
          </section>
          <section>
            <h2>¿CÓMO USAMOS TU INFORMACIÓN PERSONAL?</h2>
            <p>
              La información personal que recolectamos nos permite mantenerte informado
              acerca de las últimas novedades de productos, actualizaciones de software y
              productos de IBEX. Por consiguiente, con la aceptación de la Política de
              Privacidad aceptas expresamente que IBEX pueda enviarte comunicaciones y
              actualizaciones sobre sus servicios, productos y ofertas por cualquier
              plataforma de correo electrónico.
            </p>
            <p>
              La información personal también nos ayuda a crear, desarrollar, operar,
              entregar y mejorar nuestros productos, servicios y contenido, además de
              prevenir pérdidas y fraudes. También podemos usar tu información personal por
              motivos de seguridad de red y cuenta, incluida la protección de nuestros
              servicios para el beneficio de todos los Usuarios, y para examinar previamente
              o analizar el contenido cargado en busca de contenido posiblemente ilegal.
            </p>
            <p>
              IBEX podrá utilizar tu información para prevenir fraudes a partir de una
              conducta determinada que detectamos en una transacción en línea con nosotros.
              IBEX podrá utilizar los datos para prevenir fraudes en los casos en los que
              sea estrictamente necesario y según nuestros intereses legítimos evaluados
              para proteger a nuestros clientes y servicios. Para determinadas transacciones
              en línea, también podemos validar la información que proporcionaste a fuentes
              de acceso público. De igual manera, se entenderá que IBEX podrá tener acceso a
              una copia digital de tu Documento Personal de Identificación (DPI) y podrá
              consultar su legitimidad ante los registros correspondientes
            </p>
            <p>
              IBEX podrá realizar consultas de la información de cada Usuario con otras
              plataformas, bases de datos y/o registros de terceros. Con la aceptación de la
              política de privacidad, se autoriza expresamente que IBEX pueda realizar las
              consultas correspondientes, para verificar la veracidad de los Datos
              Personales proporcionados.
            </p>
            <p>
              Finalmente, podemos usar tu información personal, incluida la fecha de
              nacimiento, para verificar tu identidad, ayudarte con la identificación de los
              Usuarios y determinar los servicios adecuados. Del mismo modo, podemos usar la
              información personal para fines internos, como auditorías, análisis de datos,
              proyecciones de mercado e investigaciones para mejorar los productos,
              servicios y comunicaciones con los clientes de IBEX.
            </p>
          </section>
          <section>
            <h2>MODALIDADES DE TRATAMIENTO</h2>
            <p>
              IBEX tratará los Datos de los Usuarios de manera adecuada y adoptará las
              medidas de seguridad apropiadas para impedir el acceso, la revelación,
              alteración o destrucción no autorizados de los Datos. El tratamiento de Datos
              se realizará mediante ordenadores y/o herramientas informáticas, siguiendo
              procedimientos y modalidades organizativas estrictamente relacionadas con las
              finalidades señaladas. Además de IBEX, en algunos casos podrán acceder a los
              Datos ciertas categorías de personas autorizadas, relacionadas con el
              funcionamiento de esta Página Web (administración, ventas, marketing,
              departamento jurídico y de administración de sistemas) o contratistas externos
              que presten servicios a IBEX (tales como proveedores externos de servicios
              técnicos, empresas de mensajería, empresas de hosting, empresas de
              informática, agencias de comunicación) que serán nombrados por el IBEX como
              Encargados del Tratamiento, si fuera necesario. Se podrá solicitar a IBEX, en
              cualquier momento, una lista actualizada de dichas personas.
            </p>
          </section>
          <section>
            <h2>RECOLECCIÓN Y USO DE INFORMACIÓN NO PERSONAL</h2>
            <p>
              Con la aceptación de la presente política de privacidad, IBEX podrá recolectar
              datos acerca de cómo usas la plataforma web. IBEX también podrá recolectar
              datos de uso, que no sean personales, en un formato que no permite asociarlos
              directamente, por sí solos, con una persona específica. Podemos recolectar,
              usar, transferir y divulgar información no personal (datos de uso) con
              cualquier propósito.
            </p>
            <p>
              IBEX podrá acceder, recolectar, utilizar y analizar cualquier información
              gestionada y/o generada en la plataforma, formas de pago, el idioma, el código
              postal, el código de área, el identificador único de dispositivo, la URL de
              procedencia, la ubicación y la zona horaria en la que se usa la plataforma de
              IBEX. Los datos compilados se consideran información no personal a los efectos
              de esta Política de Privacidad. De igual manera, se considerará como
              información no personal los Datos Personales que sean procesados y
              anonimizados para no vincular la información a una persona en concreto. IBEX
              no recaba Datos Sensibles del Usuario.
            </p>
            <p>
              IBEX podrá recolectar y almacenar detalles de cómo usas nuestros servicios,
              incluidas las consultas de búsquedas. Esta información puede usarse para
              mejorar la relevancia de los resultados proporcionados por nuestros servicios.
              Salvo en casos limitados para asegurar la calidad de nuestros servicios en
              Internet, no se asociará esa información con tu dirección IP.
            </p>
            <p>
              Si efectivamente combinamos información no personal con información personal,
              la información combinada se tratará como información no personal mientras se
              mantenga combinada. Todos los resultados, análisis, índices y proyecciones del
              uso de la plataforma web no representará una comercialización de Datos
              Personales; siempre que no se haga una alusión a un Usuario en particular.
            </p>
            <p>
              En todo caso, los datos de uso no se sujetan al régimen de hábeas data o
              protección de datos personales de la presente Política de Privacidad.
            </p>
          </section>
          <section>
            <h2>DIVULGACIÓN A TERCEROS</h2>
            <p>
              Podrá ser necesario que IBEX divulgue tu información personal, debido a un
              proceso legal, litigio y/o solicitud de autoridades y gubernamentales dentro o
              fuera de tu país de residencia. Igualmente, podemos divulgar información
              acerca de tu persona si determinamos que es necesario o apropiado por motivos
              de seguridad, cumplimiento de la ley u otros asuntos de importancia pública.
              También podemos revelar tu información, solo si hay un fundamento legal para
              hacerlo o determinamos que la divulgación es razonablemente necesaria para
              exigir el cumplimiento de nuestros términos y condiciones o proteger nuestras
              operaciones o a nuestros Usuarios. Asimismo, en el caso de una reorganización,
              fusión o venta, podremos transferir toda información personal que recolectamos
              al tercero que corresponda.
            </p>
          </section>
          <section>
            <h2>PERÍODO DE CONSERVACIÓN</h2>
            <p>
              Los Datos Personales serán tratados y conservados durante el tiempo necesario
              y para la finalidad por la que han sido recogidos.
            </p>
            <p>Por lo tanto:</p>
            <ul>
              <li>
                <p>
                  Los Datos Personales recogidos para la formalización para la prestación
                  del servicio por el IBEX al Usuario deberán conservarse como tales hasta
                  por un plazo máximo de tres (3) años.
                </p>
              </li>
              <li>
                <p>
                  Los Datos Personales recogidos en legítimo interés de IBEX podrán
                  conservarse hasta por un máximo de un (1) año.
                </p>
              </li>
            </ul>
            <p>
              IBEX podrá conservar los Datos Personales durante un periodo adicional cuando
              el Usuario preste su consentimiento a tal tratamiento, siempre que dicho
              consentimiento siga vigente. Además, IBEX estará obligado a conservar Datos
              Personales durante un periodo adicional siempre que se precise para el
              cumplimiento de una obligación legal o por orden que proceda de la autoridad.
              Una vez terminado el período de conservación, los Datos Personales deberán
              eliminarse. Por lo tanto, los derechos de acceso, modificación, rectificación
              y portabilidad de datos no podrán ejercerse una vez haya expirado dicho
              periodo. En caso de duda, se entenderá que IBEX podrá mantener los Datos
              Personales, mientras el Usuario siga utilizando cualquier servicio o producto
              de IBEX.
            </p>
          </section>
          <section>
            <h2>CLÁUSULA DE CONSENTIMIENTO Y EXONERACIÓN DE RESPONSABILIDAD</h2>
            <p>
              Yo, el Usuario, autorizo expresamente a ***, SOCIEDAD ANÓNIMA a la
              recopilación de datos de uso y cierta información personal para el uso de la
              plataforma web. De igual manera, reconozco expresamente que a ****, SOCIEDAD
              ANÓNIMA no realiza una comercialización de Datos Personales o Datos Sensibles.
              Esta autorización se otorga bajo reserva de que se garanticen los derechos de
              acceso, rectificación, confidencialidad y exclusión de la información. En
              virtud de lo autorizado en este documento y cláusula específica, reconozco que
              resulta inaplicable lo estipulado en el Código Penal de la República de
              Guatemala y la Ley de Acceso a la Información Pública de la República de
              Guatemala, por lo que exonero a ****, SOCIEDAD ANÓNIMA, de cualquier
              responsabilidad
            </p>
            <p>
              El Usuario confirma que la aceptación de la presente Política de Privacidad
              representa su consentimiento expreso por escrito y no se incurre en ningún
              momento en vicio de la voluntad.
            </p>
          </section>
          <section>
            <h2>MODALIDADES DE TRATAMIENTO DE DATOS</h2>
            <p>
              IBEX podrá analizar, recopilar y gestionar todos los Datos Personales y deberá
              dar a los datos de los Usuarios un tratamiento adecuado, adoptando las medidas
              de seguridad apropiadas para impedir el acceso, la revelación, alteración o
              destrucción no autorizados de los Datos.
            </p>
            <p>
              El tratamiento de Datos se realizará mediante ordenadores y/o herramientas
              informáticas que IBEX considere apropiadas, siguiendo procedimientos y
              modalidades organizativas estrictamente relacionadas con las finalidades
              señaladas
            </p>
            <section>
              <h3>EN TÉRMINOS LEGALES, ESTO ES LO QUE DEBES SABER</h3>
              <strong>Derechos del Usuario</strong>
              <p>
                Nosotros nos preocupamos por tu seguridad y reconocemos que cada uno de los
                Usuarios tiene derecho sobre su información personal:
              </p>
              <ol>
                <li>
                  <p>
                    Acceso a la información: hace referencia al derecho que tiene la persona
                    para poder tener acceso a la información generada, administrada o en
                    poder de IBEX.
                  </p>
                </li>
                <li>
                  <p>
                    Rectificación de información personal: garantía que toda persona tiene
                    derecho a conocer lo que de ella conste en las bases de datos de IBEX y
                    poder corregirla o rectificarla siempre que lo considere necesario.
                  </p>
                </li>
                <li>
                  <p>
                    Exclusión de ciertos datos personales: el Usuario tiene derecho a
                    solicitar que la plataforma excluya de su base de datos la información
                    personal del usuario en cualquier momento, siempre y cuando, el Usuario
                    haya dejado de utilizar el o los servicios de IBEX.
                  </p>
                </li>
                <li>
                  <p>
                    Confidencialidad de la información recolectada: toda la información de
                    carácter personal o datos sensibles, son utilizados únicamente por
                    nosotros y no son comercializados con ningún tercero debido a la
                    confidencialidad de dicha información.
                  </p>
                </li>
              </ol>
              <Box my={4}>
                <TableContainer>
                  <Table stickyHeader aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHead} align="center">
                          DERECHO DEL USUARIO
                        </TableCell>
                        <TableCell className={classes.tableHead} align="center">
                          GARANTIZADO POR IBEX
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell align="center">Acceso a su información </TableCell>
                        <TableCell align="center">SI</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell align="center">
                          Rectificación de información personal
                        </TableCell>
                        <TableCell align="center">SI</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell align="center">
                          Exclusión de ciertos datos personales
                        </TableCell>
                        <TableCell align="center">SI</TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell align="center">
                          Confidencialidad de la información recolectada
                        </TableCell>
                        <TableCell align="center">SI</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </section>
          </section>
          <section>
            <h2>EJERCICIO DE DERECHOS</h2>
            <ol>
              <li>
                <p>
                  Sin perjuicio de lo que dispongan otras leyes, sólo los Usuarios de los
                  Datos Personales o sus representantes legales podrán solicitar una copia y
                  tener acceso a los datos que utilice IBEX Esta información deberá ser
                  entregada por IBEX, dentro de los cincuenta (50) días hábiles siguientes
                  contados a partir de la presentación de la solicitud, en formato
                  comprensible para el Usuario, o bien de la misma forma debe comunicarle
                  por escrito que el sistema de no contiene datos del referido Usuario.
                </p>
              </li>
              <li>
                <p>
                  Los Usuarios o sus representantes legales podrán solicitar que se
                  actualicen sus datos contenidos en cualquier sistema de información. Con
                  tal propósito, el interesado debe entregar una solicitud de actualización,
                  en el que señale las modificaciones que desea realizar y aporte la
                  documentación que motive su petición. IBEX deberá entregarle al Usuario,
                  en un plazo no mayor de cincuenta (50) días hábiles desde la presentación
                  de la solicitud, una resolución que haga constar las modificaciones o
                  bien, le informe de manera fundamentada, las razones por las cuales no
                  procedieron las mismas.
                </p>
              </li>
              <li>
                <p>
                  El usuario podrá solicitar la exclusión y confidencialidad de sus datos
                  únicamente si se encuentra solvente y ha cancelado el uso de todos los
                  productos y servicios de IBEX. Pese a lo anterior, IBEX podrá seguir
                  haciendo uso de los datos de uso de forma ilimitada e indeterminada. En
                  caso de solicitar la confidencialidad y exclusión de los datos, IBEX podrá
                  analizar si don datos relevantes que deban ser revelados a una autoridad
                  pública por motivos legítimos o si no son necesarios que IBEX los retenga
                  por exigencia de la ley o con propósitos comerciales legítimos.
                </p>
              </li>
              <li>
                <p>
                  Cualquier solicitud para ejercer los derechos del Usuario puede dirigirse
                  a IBEX a través de los datos de contacto facilitados en el presente
                  documento. Dichas solicitudes serán tramitadas por el IBEX sin coste
                  alguno tan pronto como le sea posible, dentro del plazo que no exceda
                  cincuenta (50) días hábiles.
                </p>
              </li>
            </ol>
          </section>
          <section>
            <h2>MODIFICACIÓN DE LA PRESENTE POLÍTICA DE PRIVACIDAD</h2>
            <p>
              IBEX se reserva el derecho de modificar esta política de privacidad en
              cualquier momento, notificándolo a los Usuarios y, de ser posible, a través de
              esta plataforma. Se recomienda que revisen esta página con frecuencia, tomando
              como referencia la fecha de la última actualización indicada al final de la
              página.
            </p>
            <p>
              En el caso de que los cambios afectasen a las actividades de tratamiento
              realizadas en base al consentimiento del Usuario, IBEX deberá obtener, si
              fuera necesario, el nuevo consentimiento del Usuario.
            </p>
          </section>
          <section>
            <h2>PREGUNTAS SOBRE LA PRIVACIDAD</h2>
            <p>
              Si tienes alguna pregunta o inquietud sobre la Política de Privacidad de IBEX,
              puedes comunicarte con nosotros. Cuando recibimos una pregunta sobre la
              privacidad o la información personal como respuesta a una solicitud de
              acceso/descarga, contamos con un equipo de especialistas que revisa tus
              consultas y aborda tu problema. Si tu problema es de una naturaleza más
              sustancial, es posible que te solicitemos más información.{" "}
            </p>
          </section>
          <section>
            <h2>DATOS DE CONTACTO</h2>
            <Box className={classes.contact}>
              <p>IBEX S.A.</p>
              <p>Correo Electrónico De Contacto IBEX:</p>
              <p>
                <strong>Fecha de última actualización: 10/22/2020</strong>
              </p>
            </Box>
          </section>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export const TermsAndConditions = withStyles((theme: Theme) => ({
  ...styles(theme),
  root: {
    "& section": {
      padding: "1em",
    },
    "& h1, h2 , h3": {
      textAlign: "center",
    },
    "& p": {
      textAlign: "justify",
    },
  },
  policyContent: {
    marginBottom: "6em",
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontWeight: "bold",
  },
  contact: {
    "& p": {
      textAlign: "center",
    },
  },
}))(Component);
