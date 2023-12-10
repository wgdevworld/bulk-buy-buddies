"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Make Request" },
  { name: "Browse Products" },
  { name: "Messages" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TopNavBar() {
  const [userId, setUserId] = useState("");

  const logoutUser = async () => {
    console.log("Button clicked!");
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      console.log(response.json());
      console.log("Successfully logged out");
      router.push("/user/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const getUserAcctInfo = async () => {
      const acctResponse = await fetch("http://127.0.0.1:5000/get_acct_info");
      const acctData = await acctResponse.json();
      if (acctData == null) {
        return;
      }
      const userId = acctData.uid;
      setUserId(userId);
    };
    getUserAcctInfo();
  }, []);

  const router = useRouter();
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    onClick={() => router.push("/")}
                    className="h-8 w-auto"
                    src="/logo.png"
                    alt="Bulk Buy Buddies Logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        className={
                          "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        }
                        onClick={() => {
                          if (userId === "") {
                            alert("Please log in first");
                            return;
                          }
                          switch (item.name) {
                            case "Make Request":
                              {
                                const createQueryString = (
                                  name: string,
                                  value: string
                                ) => {
                                  const params = new URLSearchParams();
                                  params.set(name, value);
                                  return params.toString();
                                };

                                router.push(
                                  "/shopper/shopperForm?" +
                                    createQueryString("uid", userId)
                                );
                              }
                              break;
                            case "Browse Products":
                              router.push("/products");
                              break;
                            case "Messages": {
                              {
                                const createQueryString = (query: object) => {
                                  const params = new URLSearchParams();
                                  for (const [name, value] of Object.entries(
                                    query
                                  )) {
                                    params.set(name, value);
                                  }
                                  return params.toString();
                                };
                                const query = {
                                  currentUserID: userId,
                                };
                                router.push(
                                  "/messenger" + "?" + createQueryString(query)
                                );
                                break;
                              }
                            }

                            default:
                              break;
                          }
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
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
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={() => {
                              router.push("/user/account");
                            }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            My Info
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            onClick={() => {
                              logoutUser();
                            }}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  className={"text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
