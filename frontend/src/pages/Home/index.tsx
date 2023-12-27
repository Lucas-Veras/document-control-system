import { Link } from "react-router-dom";
import PdfLogo from "../../assets/svgs/pdf.svg";
import { useUser } from "../../hooks/useUser";
import { Menu, Transition } from "@headlessui/react";
import { FaRegUser } from "react-icons/fa";
import { Fragment, useMemo } from "react";
import useAuth from "../../hooks/useAuth";
import { formatText } from "../../utils/formatText";
import { classNames } from "../../utils/classNames";

const navigation = [
  { name: "Meus documentos", to: "/dashboard" },
  { name: "Criar documento", to: "/newdocument" },
  { name: "Verificar documento", to: "/verifydocument" },
];

const Home = () => {
  const { logoutUser } = useAuth();

  const { user } = useUser();
  const userNavigation = useMemo(
    () => [{ name: "Sair", onClick: logoutUser }],
    [logoutUser]
  );

  return (
    <div className="min-h-screen bg-light">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 px-8"
          aria-label="Global"
        >
          <div className="flex flex-1">
            <Link to={"/"} className="-m-1.5 p-1.5">
              <img className="h-12 w-auto" src={PdfLogo} alt="pdf" />
            </Link>
          </div>

          <div className="flex flex-1 justify-end">
            {user ? (
              <Menu as="div" className="relative ml-3">
                <div className="flex justify-center items-center gap-2 text-white text-xs">
                  <p className="text-gray-900">
                    {formatText(user?.first_name, 15)}
                  </p>
                  <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-primary text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary p-2">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <FaRegUser
                      className="h-4 w-4 text-white"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {navigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.to}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <button
                            onClick={item.onClick}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to={"/login"}
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Login <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-60 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-19rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#CC475E] to-[#9089fc] opacity-95 sm:opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(100% 50%, 100% 61.6%, 97.5% 50%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl py-[30vh] md:pt-[25vh]">
          <div className="text-center">
            <h1 className="text-4xl md:text-3xl font-bold tracking-tight text-gray-900 ">
              Secure<span className="text-primary">Sign</span>
            </h1>
            <p className="mt-6 text-lg md:text-base leading-8 text-gray-600">
              O SecureSign é mais do que uma ferramenta de assinatura - é a
              garantia da segurança e integridade dos seus documentos. Proteja
              seus contratos, acordos e informações confidenciais com uma
              solução confiável e inovadora.
            </p>
            <div className="mt-10 md:mt-6 flex items-center justify-center gap-x-4">
              <Link
                to={"/login"}
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Comece agora
              </Link>
              <Link
                to={"/verifydocument"}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Verifique um PDF <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
