import { Disclosure, Menu, Transition } from "@headlessui/react";
import React, { Fragment, useMemo } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import PdfLogo from "../../assets/svgs/pdf.svg";
import useAuth from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";
import { formatText } from "../../utils/formatText";
import { classNames } from "../../utils/classNames";

const navigation = [
  { name: "Meus documentos", to: "/dashboard" },
  { name: "Criar documento", to: "/newdocument" },
  { name: "Verificar documento", to: "/verifydocument" },
];

export default function PrivateTemplate({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode[] | React.ReactNode;
}) {
  const { logoutUser } = useAuth();
  const { user } = useUser();

  const userNavigation = useMemo(
    () => [{ name: "Sair", onClick: logoutUser }],
    [logoutUser]
  );

  return (
    <div className="h-full">
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-header">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link className="flex-shrink-0" to={"/"} title="SecureSign">
                      <img className="w-14" src={PdfLogo} alt="Your Company" />
                    </Link>
                    <div className="md:hidden block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? "bg-headerFocus text-white rounded-md px-3 py-2 text-sm font-medium"
                                  : "text-white hover:bg-headerHover/90 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                              )
                            }
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div className="flex justify-center items-center gap-2 text-white text-xs">
                          <p>{user?.first_name}</p>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-headerFocus text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-headerFocus p-2">
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
                            {user ? (
                              userNavigation.map((item) => (
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
                              ))
                            ) : (
                              <Menu.Item>
                                <Link
                                  to="/login"
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Entrar
                                </Link>
                              </Menu.Item>
                            )}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 md:flex hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-headerFocus p-2 text-white hover:bg-headerFocus/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-headerFocus">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? <IoMdClose /> : <IoMdMenu />}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="hidden md:block">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? "bg-headerFocus "
                            : "hover:bg-headerHover hover:text-white"
                        } text-white block rounded-md px-3 py-2 text-base font-medium`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0 text-white bg-headerFocus text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-headerFocus p-2 rounded-full">
                      <FaRegUser />
                    </div>
                    <div className="ml-3">
                      {user ? (
                        <>
                          <div className="text-base font-medium leading-none text-white">
                            {formatText(user?.first_name, 80)}
                          </div>
                          <div className="text-sm font-medium leading-none text-gray-200">
                            {formatText(user?.email)}
                          </div>
                        </>
                      ) : (
                        <Link
                          to="/login"
                          className="text-white text-base font-medium"
                        >
                          Entrar
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {user &&
                      userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="button"
                          onClick={item.onClick}
                          className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-headerHover hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {name}
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
